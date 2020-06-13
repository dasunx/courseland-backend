const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const Course = require('../models/Courses');
const { count } = require('../models/Courses');

//@desc create course
//@route api/courses(POST)
router.post(
    '/',
    [
        auth,
        [
            check('name', 'name is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('slang', 'Slang is required').not().isEmpty(),
            check('featuredImage', 'Featured Image is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            name,
            description,
            price,
            tags,
            slang,
            featuredImage
        } = req.body;

        const courseInfo = {};
        courseInfo.user = req.user.id;
        if (name) courseInfo.name = name;
        if (description) courseInfo.description = description;
        if (price) courseInfo.price = price;
        if (slang) courseInfo.slang = slang;
        if (featuredImage) courseInfo.featuredImage = featuredImage;
        if (tags) {
            courseInfo.tags = tags.split(',').map((tag) => tag.trim());
        }

        try {
            let course = await Course.findOne({ slang });
            if (course) {
                return res.status(400).json({
                    errors: [
                        {
                            msg:
                                'Course with this slang is already exists. Please change the slang'
                        }
                    ]
                });
            }

            course = new Course(courseInfo);
            await course.save();
            res.json(course);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);

//@desc  get courses
//@route api/courses(GET)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('user', ['name']);
        res.json(courses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@desc  get course by slang
//@route api/courses/course/:slang (GET)
router.get('/course/:slang', async (req, res) => {
    try {
        const course = await Course.findOne({
            slang: req.params.slang
        }).populate('user', ['name']);

        if (!course) {
            return res
                .status(400)
                .json({ msg: 'No course found for this URL' });
        }
        res.json(course);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@desc  Delete course by id
//@route api/courses/:id (DELETE)
router.delete('/:id', auth, async (req, res) => {
    try {
        //delete a course
        await Course.findByIdAndRemove({ _id: req.params.id });
        res.json({ msg: 'Course deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
