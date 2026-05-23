const Joi = require("joi");



exports.registerStaffSchema = Joi.object({
    Firstname:   Joi.string().trim().min(2).max(50).required(),
    Lastname:    Joi.string().trim().min(2).max(50).required(),
    email:       Joi.string().email().required(),
    password:    Joi.string().min(6).required(),
    nationalId:  Joi.string().trim().required(),
    phone:       Joi.string().trim().optional().allow("", null),
    role:        Joi.string().valid("admin", "receptionist").default("receptionist"),
    jobTitle:    Joi.string().trim().optional().allow("", null),
    joinDate:    Joi.date().optional().allow(null),
    salary:      Joi.number().positive().optional().allow(null),
    profileImage: Joi.string().uri().optional().allow("", null),
    specializations: Joi.array().items(Joi.string()).optional().default([]).allow(null), 
    schedule:    Joi.array().items(
        Joi.object({
            day:       Joi.string().valid("MON","TUE","WED","THU","FRI","SAT","SUN").required(),
            startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
            endTime:   Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
        })
    ).optional().default([]),
});

exports.updateStaffSchema = Joi.object({
    Firstname:    Joi.string().trim().min(2).max(50).optional(),
    Lastname:     Joi.string().trim().min(2).max(50).optional(),
    phone:        Joi.string().trim().optional().allow("", null),
    jobTitle:     Joi.string().trim().optional().allow("", null),
    salary:       Joi.number().positive().optional().allow(null),
    auxStatus:    Joi.string().valid("working","break","management","off_duty","on_leave").optional(),
    profileImage: Joi.string().uri().optional().allow("", null),
    specializations: Joi.alternatives().try(          
        Joi.array().items(Joi.string()),
        Joi.string().allow("", null)
    ).optional().allow(null),
    schedule: Joi.array().items(
        Joi.object({
            day:       Joi.string().valid("MON","TUE","WED","THU","FRI","SAT","SUN").required(),
            startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
            endTime:   Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
        })
    ).optional(),
});