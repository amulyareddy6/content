const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image') {
            cb(null, 'uploads/images/');
        } else if (file.fieldname === 'video') {
            cb(null, 'uploads/videos/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

const contentList = [];

app.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), (req, res) => {
    const { title, content } = req.body;
    const image = req.files['image'][0];
    const video = req.files['video'][0];

    const newContent = {
        title,
        content,
        image: image ? image.path : null,
        video: video ? video.path : null,
    };

    contentList.push(newContent);
    res.redirect('/');
});

app.get('/content', (req, res) => {
    res.json(contentList);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
