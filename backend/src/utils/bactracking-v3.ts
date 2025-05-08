import { prisma } from "../config/prisma";
import { Schedule, ScheduleData } from "../types/types";

/**
 * Enhanced function to check the validity of a schedule placement
 * and detect potential conflicts or constraints violations
 */
function isValidPlacement(
    currentSchedule: Schedule[],
    courseID: number,
    classID: number,
    roomID: number,
    timeSlotID: number,
    lectureID: number,
    timeSlot: { day: string, starTime: Date, endTime: Date }
): boolean {
    // Check for basic conflicts
    for (const schedule of currentSchedule) {
        // Check if the same course is already scheduled at this time slot
        if (schedule.courseID === courseID && schedule.timeSlotID === timeSlotID)
            return false;

        // Check if the class is already busy at this time slot
        if (schedule.classID === classID && schedule.timeSlotID === timeSlotID)
            return false;

        // Check if the room is already occupied at this time slot
        if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID)
            return false;

        // Check if the lecturer is already teaching at this time slot
        if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID)
            return false;

        // Prevent the same course being taught to different classes at the same time
        if (schedule.courseID === courseID && schedule.timeSlotID === timeSlotID && schedule.classID !== classID)
            return false;

        // Prevent different courses being scheduled at the same time for classes in the same program
        if (schedule.timeSlotID === timeSlotID) {
            const currentClassName = schedule.className;
            const newClassName = getClassNameById(currentSchedule, classID);

            if (currentClassName && newClassName) {
                const currentClassPrefix = extractClassPrefix(currentClassName);
                const newClassPrefix = extractClassPrefix(newClassName);

                if (currentClassPrefix === newClassPrefix && schedule.classID !== classID) {
                    return false;
                }
            }
        }
    }

    // Check for day distribution - prevent too many classes on the same day
    const dayCount = getDayCountInSchedule(currentSchedule, timeSlot.day);
    const maxClassesPerDay = 3; // Adjust as needed to balance the schedule across days
    if (dayCount >= maxClassesPerDay) {
        return false;
    }

    // Check for room diversity - prevent overuse of the same room
    const roomUsageCount = getRoomUsageCount(currentSchedule, roomID);
    const maxRoomUsage = Math.ceil(currentSchedule.length / 3) + 1; // Adjust formula as needed
    if (roomUsageCount >= maxRoomUsage) {
        return false;
    }

    // If all checks pass, the placement is valid
    return true;
}

/**
 * Helper function to extract class prefix (e.g., "Teknik Info" from "Teknik Info A")
 */
function extractClassPrefix(className: string): string {
    return className.replace(/[A-Z0-9]$/, "").trim();
}

/**
 * Helper function to get class name by ID from current schedule
 */
function getClassNameById(schedule: Schedule[], classID: number): string {
    const existingEntry = schedule.find(s => s.classID === classID);
    return existingEntry?.className || "";
}

/**
 * Count how many classes are scheduled on a specific day
 */
function getDayCountInSchedule(schedule: Schedule[], day: string): number {
    return schedule.filter(s => s.day === day).length;
}

/**
 * Count how many times a specific room is used in the schedule
 */
function getRoomUsageCount(schedule: Schedule[], roomID: number): number {
    return schedule.filter(s => s.roomID === roomID).length;
}

/**
 * Recursive backtracking function for course scheduling with optimization
 * @param data - Data required for scheduling
 * @param currentSchedule - Current temporary schedule being built
 * @param result - Array to store the final schedule
 * @param attemptCount - Counter to prevent infinite loops
 * @returns true if all courses are successfully scheduled, false otherwise
 */
export async function backtrackScheduling(
    data: ScheduleData,
    currentSchedule: Schedule[],
    result: Schedule[],
    attemptCount: number = 0,
    maxAttempts: number = 1000
): Promise<boolean> {
    const { classes, courses, lecturePreferenceMap, rooms, timeSlots, options } = data;

    // Calculate total number of schedules needed
    const totalSchedulesNeeded = courses.length * classes.length;

    // Protection against infinite loops
    if (attemptCount > maxAttempts) {
        console.warn(`Reached maximum attempt count (${maxAttempts}). Accepting best schedule so far.`);
        if (currentSchedule.length > 0) {
            result.push(...JSON.parse(JSON.stringify(currentSchedule)));
            return true;
        }
        return false;
    }

    // If we've scheduled everything successfully
    if (currentSchedule.length === totalSchedulesNeeded) {
        console.log('Found complete valid schedule');

        // Check if the schedule is well-distributed - but don't be too strict
        const distributionQuality = evaluateScheduleDistribution(currentSchedule);
        if (distributionQuality >= 0.7) { // Accept schedules with at least 70% quality score
            // Copy the successful schedule to the result
            result.push(...JSON.parse(JSON.stringify(currentSchedule)));

            // Save to database if requested
            if (options?.saveToDatabase !== false) {
                try {
                    console.log('Saving schedules to database...');
                    for (const schedule of currentSchedule) {
                        await prisma.schedule.create({
                            data: {
                                classID: schedule.classID,
                                courseID: schedule.courseID,
                                lectureID: schedule.lectureID,
                                roomID: schedule.roomID,
                                timeSlotID: schedule.timeSlotID
                            }
                        });
                    }
                    console.log('Successfully saved schedules to database.');
                } catch (error) {
                    console.error('Error saving schedules to database:', error);
                }
            }
            return true;
        } else {
            console.log(`Found complete schedule but quality score is only ${distributionQuality.toFixed(2)}. Continuing search...`);
            // If we're getting desperate (high attempt count), accept lower quality schedules
            if (attemptCount > maxAttempts * 0.8 && distributionQuality >= 0.5) {
                console.log(`Accepting lower quality schedule after ${attemptCount} attempts.`);
                result.push(...JSON.parse(JSON.stringify(currentSchedule)));
                return true;
            }
            return false; // Keep searching for a better distribution
        }
    }

    // Determine which course and class to schedule next
    const scheduleIndex = currentSchedule.length;
    const courseIndex = Math.floor(scheduleIndex / classes.length);
    const classIndex = scheduleIndex % classes.length;

    // Get the course and class to be scheduled
    const course = courses[courseIndex];
    const classItem = classes[classIndex];

    if (!course || !classItem) {
        console.warn('Missing course or class data. This should not happen.');
        return false;
    }

    console.log(`Scheduling course ${course.code} for class ${classItem.code} (${scheduleIndex + 1}/${totalSchedulesNeeded})`);

    // Optimize search by trying more likely combinations first
    const lecturerID = course.lectureID;
    const hasPreference = lecturePreferenceMap[lecturerID] && lecturePreferenceMap[lecturerID].length > 0;

    // Create a scoring function for time slots to prioritize diversity
    const scoreTimeSlot = (timeSlot: any): number => {
        let score = 0;

        // Prioritize days with fewer classes already scheduled
        const dayCount = getDayCountInSchedule(currentSchedule, timeSlot.day);
        score -= dayCount * 3; // Penalty for days that already have many classes, but not as severe

        // Prioritize different days of the week (not just Friday)
        // Prioritize weekdays over weekends
        const dayOfWeekScore = {
            'Monday': 10,
            'Tuesday': 10,
            'Wednesday': 10,
            'Thursday': 10,
            'Friday': 8,  // Still good, but slightly lower score
            'Saturday': 5,
            'Sunday': 0
        };
        score += dayOfWeekScore[timeSlot.day as keyof typeof dayOfWeekScore] || 0;

        // Prioritize morning slots over late afternoon
        const hour = timeSlot.starTime.getHours();
        if (hour >= 8 && hour <= 12) score += 5; // Morning slots
        else if (hour > 12 && hour <= 15) score += 3; // Early afternoon
        else if (hour > 15 && hour <= 17) score += 1; // Late afternoon
        else score -= 1; // Evening slots (less penalty)

        // Lecturer preference bonus
        if (hasPreference && lecturePreferenceMap[lecturerID].includes(timeSlot.id)) {
            score += 10; // Bonus for lecturer preference, but not as dominant
        }

        return score;
    };

    // Sort time slots based on the scoring function
    const sortedTimeSlots = [...timeSlots].sort((a, b) => {
        return scoreTimeSlot(b) - scoreTimeSlot(a); // Higher score first
    });

    // Create a scoring function for rooms
    const scoreRoom = (room: any): number => {
        let score = 0;

        // Prioritize room diversity - avoid using the same room too often
        const roomUsage = getRoomUsageCount(currentSchedule, room.id);
        score -= roomUsage * 2; // Penalty for rooms already used a lot, but not as severe

        // You can add other room scoring factors here
        // For example, match room capacity with expected class size

        return score;
    };

    // Sort rooms based on the scoring function
    const sortedRooms = [...rooms].sort((a, b) => {
        return scoreRoom(b) - scoreRoom(a); // Higher score first
    });

    // Adaptive constraints based on attempt count
    const isAttemptingLastSlots = attemptCount > maxAttempts * 0.5;

    // Iterate through all possible combinations of rooms and time slots
    for (const timeSlot of sortedTimeSlots) {
        // Skip time slots that don't match lecturer preferences only if we're not getting desperate
        if (hasPreference &&
            lecturePreferenceMap[lecturerID].length > 0 &&
            !lecturePreferenceMap[lecturerID].includes(timeSlot.id) &&
            !isAttemptingLastSlots) {
            continue;
        }

        // Check for class program conflicts at this time slot - relax this constraint if we're getting desperate
        if (!isAttemptingLastSlots) {
            const classPrefix = extractClassPrefix(classItem.code);
            let hasConflict = false;

            for (const existing of currentSchedule) {
                const existingClassPrefix = extractClassPrefix(existing.className!);
                if (existingClassPrefix === classPrefix &&
                    existing.timeSlotID === timeSlot.id &&
                    existing.classID !== classItem.id) {
                    hasConflict = true;
                    break;
                }
            }

            if (hasConflict) continue;
        }

        for (const room of sortedRooms) {
            // Use adaptive validation - relax constraints if we're running out of attempts
            if (isValidPlacementAdaptive(
                currentSchedule,
                course.id,
                classItem.id,
                room.id,
                timeSlot.id,
                lecturerID,
                timeSlot,
                isAttemptingLastSlots
            )) {
                const newSchedule: Schedule = {
                    courseID: course.id,
                    classID: classItem.id,
                    lectureID: lecturerID,
                    roomID: room.id,
                    timeSlotID: timeSlot.id,
                    courseCode: course.code,
                    className: classItem.code,
                    lectureName: course.lecture.name,
                    roomCode: room.code,
                    day: timeSlot.day,
                    startTime: timeSlot.starTime,
                    endTime: timeSlot.endTime
                };

                // Add the schedule to the temporary schedule
                currentSchedule.push(newSchedule);

                // Continue backtracking with the updated schedule
                const success = await backtrackScheduling(
                    data,
                    currentSchedule,
                    result,
                    attemptCount + 1,
                    maxAttempts
                );
                if (success) return true;

                // If not successful, remove the last schedule (backtrack)
                currentSchedule.pop();
            }
        }
    }

    // If we reach this point and we're close to the complete schedule, relax all constraints
    // and try again with any available slot
    if (currentSchedule.length >= totalSchedulesNeeded * 0.9 && attemptCount < maxAttempts * 0.9) {
        console.log(`We're at ${currentSchedule.length}/${totalSchedulesNeeded} schedules. Relaxing all constraints for last slots.`);

        for (const timeSlot of timeSlots) {
            for (const room of rooms) {
                // Only enforce basic constraints to avoid direct conflicts
                if (isValidPlacementMinimal(currentSchedule, course.id, classItem.id, room.id, timeSlot.id, lecturerID)) {
                    const newSchedule: Schedule = {
                        courseID: course.id,
                        classID: classItem.id,
                        lectureID: lecturerID,
                        roomID: room.id,
                        timeSlotID: timeSlot.id,
                        courseCode: course.code,
                        className: classItem.code,
                        lectureName: course.lecture.name,
                        roomCode: room.code,
                        day: timeSlot.day,
                        startTime: timeSlot.starTime,
                        endTime: timeSlot.endTime
                    };

                    currentSchedule.push(newSchedule);
                    const success = await backtrackScheduling(
                        data,
                        currentSchedule,
                        result,
                        attemptCount + 1,
                        maxAttempts
                    );
                    if (success) return true;
                    currentSchedule.pop();
                }
            }
        }
    }

    // If we reach this point, no valid combination was found
    // We can choose to return a partial schedule if allowed
    if ((options?.allowPartialResults || attemptCount > maxAttempts * 0.95) && currentSchedule.length > 0) {
        console.log(`Could not complete full schedule. Returning partial schedule with ${currentSchedule.length}/${totalSchedulesNeeded} schedules.`);
        result.push(...JSON.parse(JSON.stringify(currentSchedule)));
        return false;
    }

    console.log(`No valid placement found for course ${course.code} and class ${classItem.code}. Backtracking...`);
    return false;
}

/**
 * Evaluates the distribution quality of a schedule on a scale of 0.0 to 1.0
 * 1.0 = perfect distribution, 0.0 = poor distribution
 */
function evaluateScheduleDistribution(schedule: Schedule[]): number {
    if (schedule.length === 0) return 0;

    // Count classes per day
    const classesPerDay: Record<string, number> = {};
    schedule.forEach(item => {
        classesPerDay[item.day!] = (classesPerDay[item.day!] || 0) + 1;
    });

    // Count rooms usage
    const roomUsage: Record<number, number> = {};
    schedule.forEach(item => {
        roomUsage[item.roomID] = (roomUsage[item.roomID] || 0) + 1;
    });

    // Count how many different days are used
    const uniqueDays = Object.keys(classesPerDay).length;
    const uniqueRooms = Object.keys(roomUsage).length;

    // Get distribution metrics
    const maxClassesOnOneDay = Math.max(...Object.values(classesPerDay));
    const avgClassesPerDay = schedule.length / uniqueDays;
    const variance = Object.values(classesPerDay).reduce(
        (acc, count) => acc + Math.pow(count - avgClassesPerDay, 2), 0
    ) / uniqueDays;

    // Calculate scores for different aspects (0.0 to 1.0 each)
    const daySpreadScore = Math.min(1, uniqueDays / 5); // Ideal: Use all 5 weekdays
    const dayBalanceScore = Math.max(0, 1 - (variance / (avgClassesPerDay * avgClassesPerDay))); // Lower variance is better
    const roomDiversityScore = Math.min(1, uniqueRooms / Math.min(3, schedule.length / 4)); // Use a reasonable number of rooms

    // Calculate final weighted score
    const finalScore = (daySpreadScore * 0.4) + (dayBalanceScore * 0.4) + (roomDiversityScore * 0.2);
    return Math.min(1, Math.max(0, finalScore)); // Ensure result is between 0 and 1
}

/**
 * A more adaptive version of isValidPlacement that can relax constraints when needed
 */
function isValidPlacementAdaptive(
    currentSchedule: Schedule[],
    courseID: number,
    classID: number,
    roomID: number,
    timeSlotID: number,
    lectureID: number,
    timeSlot: { day: string, starTime: Date, endTime: Date },
    relaxConstraints: boolean = false
): boolean {
    // Core constraints that cannot be relaxed
    for (const schedule of currentSchedule) {
        // Check if the class is already busy at this time slot (never allow same class at same time)
        if (schedule.classID === classID && schedule.timeSlotID === timeSlotID)
            return false;

        // Check if the room is already occupied at this time slot (never allow same room at same time)
        if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID)
            return false;

        // Check if the lecturer is already teaching at this time slot (never allow same lecturer at same time)
        if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID)
            return false;
    }

    // Optional constraints that can be relaxed when we're desperate
    if (!relaxConstraints) {
        for (const schedule of currentSchedule) {
            // Check if the same course is already scheduled at this time slot
            if (schedule.courseID === courseID && schedule.timeSlotID === timeSlotID)
                return false;

            // Prevent different courses being scheduled at the same time for classes in the same program
            if (schedule.timeSlotID === timeSlotID) {
                const currentClassName = schedule.className;
                const newClassName = getClassNameById(currentSchedule, classID);

                if (currentClassName && newClassName) {
                    const currentClassPrefix = extractClassPrefix(currentClassName);
                    const newClassPrefix = extractClassPrefix(newClassName);

                    if (currentClassPrefix === newClassPrefix && schedule.classID !== classID) {
                        return false;
                    }
                }
            }
        }

        // Check for day distribution - prevent too many classes on the same day
        const dayCount = getDayCountInSchedule(currentSchedule, timeSlot.day);
        const maxClassesPerDay = 4; // A bit more relaxed than before
        if (dayCount >= maxClassesPerDay) {
            return false;
        }

        // Check for room diversity - prevent overuse of the same room
        const roomUsageCount = getRoomUsageCount(currentSchedule, roomID);
        const maxRoomUsage = Math.ceil(currentSchedule.length / 2) + 2; // More relaxed formula
        if (roomUsageCount >= maxRoomUsage) {
            return false;
        }
    }

    // If all checks pass, the placement is valid
    return true;
}

/**
 * Minimal validation that only enforces the absolute must-have constraints
 * Used as a last resort when all other placements fail
 */
function isValidPlacementMinimal(
    currentSchedule: Schedule[],
    courseID: number,
    classID: number,
    roomID: number,
    timeSlotID: number,
    lectureID: number
): boolean {
    // Only enforce the most critical constraints
    for (const schedule of currentSchedule) {
        // A class cannot be in two places at once
        if (schedule.classID === classID && schedule.timeSlotID === timeSlotID)
            return false;

        // A room cannot host two classes at once
        if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID)
            return false;

        // A lecturer cannot teach two classes at once
        if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID)
            return false;
    }

    // If these critical checks pass, the placement is minimally valid
    return true;
}