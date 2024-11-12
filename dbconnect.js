const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
// XỬ LÍ HÌNH ẢNH
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const uploadCategory = require('./upload_category');
const uploadThumbnail = require('./upload_thumbnail');
const uploadArticle = require('./upload_article'); const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}




const app = express();
app.use(cors());
// Cấu hình để tăng giới hạn kích thước request
app.use(bodyParser.json({ limit: '10mb' }));  // Cho phép payload kích thước tối đa 10MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Thay thế bằng user MySQL của bạn
  password: '',  // Thay thế bằng password MySQL của bạn
  database: 'webtintuc'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối với MySQL: ', err);
    return;
  }
  console.log('Kết nối thành công với MySQL ',);
});


// Lắng nghe trên port 3000
app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000');
});

// API đăng nhập
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Truy vấn người dùng từ cơ sở dữ liệu
  const sql = 'SELECT * FROM User WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.json({ message: 'Tên đăng nhập không tồn tại', status: 0 });
    }

    const user = result[0];


    if (result.length > 0) {
      if (user.password === password) {
        if (Number(user.status) === 0) {
          return res.json({ message: 'Tài khoản đã bị khóa', status: 0 });
        }
        return res.json({ message: 'Đăng nhập thành công', user: user, status: 1 });
      } else {
        return res.json({ message: 'Sai mật khẩu', status: 0 });

      }
    }
  });
});

// API GET TAT CA USERS
app.get('/api/getallusers', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ user: results });
  });
});
// API QUEN MAT KHAU
app.post('/api/quenmatkhau', (req, res) => {
  const { username, email, password } = req.body;

  const sql1 = 'SELECT * FROM User WHERE username = ?';
  db.query(sql1, [username], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.json({ message: 'Tên đăng nhập không tồn tại', trangthai: 0 });

    }
    const user = result[0];
    if (result.length > 0) {
      if (user.email !== email) {
        return res.json({ message: 'Email không đúng', trangthai: 0 });
      } else {
        const sql2 = 'UPDATE User SET password = ? WHERE email = ?';
        db.query(sql2, [password, email], (err, result) => {
          if (err) {
            return res.status(500).send(err);
          } else {
            return res.json({ message: 'Đổi mật khẩu thành công', trangthai: 1 });
          }
        });
      }
    }
  })
})


//API DANG KI USER
app.post('/api/dangki', (req, res) => {
  const { username, email, password } = req.body;
  const role = 'viewer';
  let now = new Date();
  const sql1 = 'Select * from user where username =? ';
  db.query(sql1, [username], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      return res.json({ message: 'Tên đăng nhập đã tồn tại', status: 0 });
    } else {
      const sql2 = 'Select * from user where email =? ';
      db.query(sql2, [email], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        } else if (result.length > 0) {
          return res.json({ message: 'Email đã tồn tại', status: 0 });
        } else {
          const sql3 = 'INSERT INTO user (username,email,password,role,created_at,status)  values (?,?,?,?,?,true)';
          db.query(sql3, [username, email, password, role, now], (err, result) => {
            if (err) {
              return res.status(500).send(err);
            }
            return res.json({ message: 'Đăng kí thành công', status: 1 });
          })
        }
      })
    }
  })
})
// GET USER BY ID
app.get('/api/user/:id', (req, res) => {
  const id = req.params.id; // Lấy id từ URL parameter
  const sql = 'SELECT * FROM user WHERE user_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err); // Lỗi máy chủ
    }
    if (result.length > 0) {
      let user = result[0];
      return res.json({ message: 'Lấy thông tin user thành công', status: 1, user: user });
    } else {
      return res.json({ message: 'Không tìm thấy user', status: 0 });
    }
  });
});
// API EDIT PROFILE 
app.post('/api/editprofile', (req, res) => {
  const { id, email, password } = req.body;
  let sql = 'update user set email = ?, password = ? where user_id = ?';
  db.query(sql, [email, password, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.json({ message: 'Không tìm thấy người dùng với ID này', status: 0 });
    } else {
      return res.json({ message: 'Cập nhật thông tin thành công', status: 1 });
    }
  })
})

// FILTER USER
app.get('/api/filteruser/:name/:email/:role', (req, res) => {
  let { name, email, role } = req.params;
  name = name.toLowerCase();
  email = email.toLowerCase();
  let sql = 'select * from user';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      const filteredUsers = result.filter(user =>

        (name === 'all' || user.username.toLowerCase().includes(name)) &&
        (email === 'all' || user.email.toLowerCase().includes(email)) &&
        (role === 'all' || user.role === role)
      );
      // Trả về dữ liệu đã lọc
      return res.json(filteredUsers);
    }
  })
});
// API EDIT USER BY ID
app.post('/api/edituser', (req, res) => {
  const { id, username, email, role, status } = req.body;
  let sql = 'update user set username = ?, email = ?, role = ?, status = ? where user_id=?';
  db.query(sql, [username, email, role, status, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows > 0) {
      return res.json({ message: 'Cập nhật thông tin thành công', status: 1 });
    }
  })
})
// API THÊM USER
app.post('/api/adduser', (req, res) => {
  const { username, email, role, status } = req.body;
  let password = 1;

  // Kiểm tra xem username hoặc email đã tồn tại hay chưa
  const checkSql = 'SELECT * FROM user WHERE username = ? OR email = ?';
  db.query(checkSql, [username, email], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      // Nếu đã tồn tại
      return res.json({ message: 'Username hoặc email đã tồn tại', status: 0 });
    } else {
      // Nếu chưa tồn tại, thực hiện thêm user mới
      const insertSql = 'INSERT INTO user (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)';
      db.query(insertSql, [username, email, password, role, status], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (result.affectedRows > 0) {
          return res.json({ message: 'Thêm user thành công', status: 1 });
        }
      });
    }
  });
});
// API GET ALL CATEGORIES
app.get('/api/category', (req, res) => {
  let sql = 'select * from category';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      return res.json(result);
    }
  })
})
// API FILTER CATEGORY
app.get('/api/category/filter/:name/:status', (req, res) => {
  let { name, status } = req.params;

  // Nếu tên là chuỗi rỗng thì gán là 'all' để lọc tất cả


  // Nếu status là 'all' thì lấy tất cả, ngược lại chuyển status thành số nguyên
  if (status === 'all') {
    status = null; // Không lọc theo status
  } else {
    status = parseInt(status); // Chuyển status từ chuỗi sang số nguyên
  }

  let sql = 'SELECT * FROM category';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      let filteredCategory = result.filter(cate => {
        const nameMatches = (name === 'all' || cate.category_name.toLowerCase().includes(name)); // So sánh chữ thường
        const statusMatches = (status === null || cate.status === status);

        return nameMatches && statusMatches;
      });

      return res.json(filteredCategory);
    } else {
      return res.json({ message: 'Không có thể loại nào phù hợp' });
    }
  });
});
/*
// Sử dụng async/await để gọi hàm và nhận kết quả
(async () => {
  try {
    const newFileName = await newNameForFileImage();
    console.log("Tên file mới:", newFileName);
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
  }
})();
*/
// IMAGE CATEGORY
const imgCategoryDir = path.join(__dirname, './webtintuc/src/assets/img_category/');
app.use('/img_category', express.static(imgCategoryDir));



// API add cate với hình ảnh
app.post('/api/category/add', uploadCategory.single('image'), (req, res) => {
  // Lấy các trường từ `req.body`
  const { name, description, status, folder } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !description || status === undefined) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc', status: 0 });
  }

  // Kiểm tra nếu có file ảnh từ `multer`
  const imageFileName = req.file ? req.file.filename : null; // Chỉ lấy tên file ảnh

  // Kiểm tra xem ảnh đã được upload thành công chưa
  if (!imageFileName) {
    return res.status(400).json({ message: 'Không có file ảnh được tải lên', status: 0 });
  }

  // Lưu chỉ tên file (UUID.jpg) vào database
  const imageName = imageFileName; // UUID + .jpg (multer đã tự động thêm phần mở rộng)

  // Câu lệnh SQL để thêm dữ liệu vào bảng `category`
  const sql = 'INSERT INTO category (category_name, description, image_cate, status) VALUES (?, ?, ?, ?)';

  // Thực hiện câu truy vấn với các giá trị cần thêm
  db.query(sql, [name, description, imageName, status], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message, status: 0 });
    }
    if (results.affectedRows > 0) {
      return res.json({ message: 'Thêm thể loại thành công', status: 1 });
    } else {
      return res.json({ message: 'Thêm thể loại thất bại', status: 0 });
    }
  });
});



// API UPDATE CATE (không có hình ảnh)
app.put('/api/category/update/:id', (req, res) => {
  const { id } = req.params;
  const { category_name, description, status } = req.body;

  let sql = 'UPDATE category SET category_name = ?, description = ?, status = ? WHERE category_id = ?';
  db.query(sql, [category_name, description, status, id], (err, results) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (results.affectedRows > 0) {
      return res.json({ message: 'Cập nhật thể loại thành công', status: 1 });
    } else {
      return res.json({ message: 'Cập nhật thể loại thất bại', status: 0 });
    }
  });
});

// API UPDATE CATE (có hình ảnh)
app.put('/api/category/updateImg/:id', uploadCategory.single('image'), (req, res) => {
  const { id } = req.params;  // Lấy ID từ params
  const { name, description, status } = req.body;  // Lấy các giá trị từ body

  console.log('Request Body:', req.body);  // Log ra body của request
  console.log('File:', req.file);  // Log ra file được upload

  // Kiểm tra xem có file ảnh mới không
  const imageFileName = req.file ? req.file.filename : null;

  // Nếu có ảnh mới, xóa ảnh cũ
  if (imageFileName) {
    // Tìm ảnh cũ trong database (dùng ID để tìm ảnh cũ)
    const sqlGetOldImage = 'SELECT image_cate FROM category WHERE category_id = ?';
    db.query(sqlGetOldImage, [id], (err, results) => {
      if (err) {
        console.log('SQL error:', err);  // Log lỗi SQL nếu có
        return res.status(500).json({ message: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Category không tồn tại' });
      }

      const oldImage = results[0].image_cate; // Lấy tên ảnh cũ
      const oldImagePath = path.join(__dirname, 'webtintuc/src/assets/img_category', oldImage);

      // Kiểm tra và xóa ảnh cũ nếu tồn tại
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);  // Xóa ảnh cũ
      }

      // Cập nhật thông tin mới vào database
      updateCategory(id, name, description, imageFileName, status, res);
    });
  } else {
    // Nếu không có ảnh mới, chỉ cập nhật thông tin mà không thay đổi ảnh
    updateCategory(id, name, description, null, status, res);
  }
});

// Hàm cập nhật thông tin category vào database
function updateCategory(id, name, description, imageFileName, status, res) {
  const sql = 'UPDATE category SET category_name = ?, description = ?, image_cate = ?, status = ? WHERE category_id = ?';

  const values = imageFileName ? [name, description, imageFileName, status, id] : [name, description, null, status, id];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.log('Error executing SQL query:', err);  // Log lỗi khi thực thi SQL
      return res.status(500).json({ message: err.message });
    }
    if (results.affectedRows > 0) {
      return res.json({ message: 'Cập nhật thể loại thành công', status: 1 });
    } else {
      return res.json({ message: 'Cập nhật thể loại thất bại', status: 0 });
    }
  });
}



// API GET ALL TAGS
app.get('/api/tag', (req, res) => {
  let sql = 'SELECT * FROM tag';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      return res.json(result);
    }
  });
});

// API FILTER TAG
app.get('/api/tag/filter/:name/:status', (req, res) => {
  let { name, status } = req.params;

  if (status === 'all') {
    status = null; // Không lọc theo status
  } else {
    status = parseInt(status); // Chuyển status từ chuỗi sang số nguyên
  }

  let sql = 'SELECT * FROM tag';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      let filteredTags = result.filter(tag => {
        const nameMatches = (name === 'all' || tag.tag_name.toLowerCase().includes(name));
        const statusMatches = (status === null || tag.status === status);
        return nameMatches && statusMatches;
      });

      return res.json(filteredTags);
    } else {
      return res.json({ message: 'Không có tag nào phù hợp' });
    }
  });
});

// API ADD TAG
app.post('/api/tag/add', (req, res) => {
  const { tag_name, status } = req.body;

  let sql = 'INSERT INTO tag (tag_name,  status) VALUES (?,  ?)';
  db.query(sql, [tag_name, status], (err, results) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (results.affectedRows > 0) {
      return res.json({ message: 'Thêm tag thành công', status: 1 });
    } else {
      return res.json({ message: 'Thêm tag thất bại', status: 0 });
    }
  });
});

// API UPDATE TAG (không có hình ảnh)
app.put('/api/tag/update/:id', (req, res) => {
  const { id } = req.params;
  const { tag_name, status } = req.body;

  let sql = 'UPDATE tag SET tag_name = ?,  status = ? WHERE tag_id = ?';
  db.query(sql, [tag_name, status, id], (err, results) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (results.affectedRows > 0) {
      return res.json({ message: 'Cập nhật tag thành công', status: 1 });
    } else {
      return res.json({ message: 'Cập nhật tag thất bại', status: 0 });
    }
  });
});
// IMAGE THUMBNAIL
const imgThumbnailDir = path.join(__dirname, './webtintuc/src/assets/thumbnail/');
app.use('/img_thumbnail', express.static(imgThumbnailDir));

// API GET ALL ARTICLE
app.get('/api/article', (req, res) => {
  let sql = 'select * from article';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ result });

  })
})
// IMAGE CONTENT 
const imgContentDir = path.join(__dirname, './webtintuc/src/assets/img_article/');
app.use('/img_article', express.static(imgContentDir));

// API ADD ARTICLE WITH TAGS
app.post('/api/article/add', uploadThumbnail.single('thumbnail'), (req, res) => {
  let { title, content, author_id, category_id, status, tags } = req.body;




  // Kiểm tra nếu có file ảnh từ `multer`
  const imageFileNameThumbnail = req.file ? req.file.filename : null; // Chỉ lấy tên file ảnh

  // Kiểm tra xem ảnh đã được upload thành công chưa
  if (!imageFileNameThumbnail) {
    return res.status(400).json({ message: 'Không có file ảnh được tải lên', status: 0 });
  }

  // Lưu chỉ tên file (UUID.jpg) vào database
  const imageNameThumbnail = imageFileNameThumbnail; // UUID + .jpg (multer đã tự động thêm phần mở rộng)




  // Thực hiện xử lý ảnh trong content (description)
  let imageUrls = [];
  const regex = /data:image\/([a-zA-Z]*);base64,([^\"]*)/g; // Regex để tìm ảnh base64 trong content

  // Tìm tất cả ảnh base64 trong content và thay thế nó bằng URL
  content = content.replace(regex, (match, p1, p2) => {
    // Generate a UUID for each image
    const fileName = `${uuidv4()}.${p1}`; // Tên file là UUID
    const filePath = path.join(__dirname, 'webtintuc/src/assets/img_article', fileName);

    // Ghi ảnh từ base64 vào file
    const base64Data = Buffer.from(p2, 'base64');
    fs.writeFileSync(filePath, base64Data);

    // Lưu URL ảnh vào mảng imageUrls
    imageUrls.push(`http://localhost:3000/img_article/${fileName}`);

    return `http://localhost:3000/img_article/${fileName}`; // Thay base64 bằng URL
  });

  // Thêm ảnh vào content đã xử lý
  const processedContent = content;

  // Lưu bài viết vào database
  const sql = 'INSERT INTO article (title, content, author_id, category_id, status, thumbnail_url, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const now = new Date();
  db.query(sql, [title, processedContent, author_id, category_id, status, imageNameThumbnail, now], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const articleId = result.insertId; // ID của bài viết vừa tạo

    // Lưu các tag liên kết với bài viết
    if (tags && tags.length > 0) {
      const tagInsertSql = 'INSERT INTO article_tags (article_id, tag_id) VALUES ?';
      const tagValues = tags.map(tagId => [articleId, tagId]);

      db.query(tagInsertSql, [tagValues], (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.json({
          message: 'Thêm bài viết thành công',
          status: 1,
          articleId: articleId
        });
      });
    } else {
      return res.json({
        message: 'Thêm bài viết thành công',
        status: 1,
        articleId: articleId
      });
    }
  });
});

app.get('/api/article/getByIdEditor/:id', (req, res) => {
  let id = req.params.id;
  let sql = `
  SELECT article_id, title, content, author_id, article.category_id, 
         category.status AS cate_status, article.status AS article_status, 
         category.category_name, thumbnail_url
  FROM article 
  INNER JOIN category ON article.category_id = category.category_id 
  WHERE author_id = ?
`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(result);
  })
})

app.get('/api/article/filterMyArticle/:id/:name/:category/:status', (req, res) => {
  let name = req.params.name;
  let category = req.params.category;
  let status = req.params.status;
  let id = req.params.id;
  let sql = `
  SELECT article_id, title, content, author_id, article.category_id, 
         category.status AS cate_status, article.status AS article_status, 
         category.category_name, thumbnail_url
  FROM article 
  INNER JOIN category ON article.category_id = category.category_id 
  WHERE author_id = ?
`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    let filtered = [];
    if (result.length === 0) {
      return res.json(result);
    } else {
      filtered = result.filter(article => (
        (name === 'all' || article.title.toLowerCase().includes(name)) &&
        (category === 'all' || article.category_name.toLowerCase().includes(category)) &&
        (status === 'all' || article.article_status === status)
      ));
      return res.json(filtered);
    }
  })
})
app.put('/api/article/updateStatus/:id', (req, res) => {
  const { id } = req.params; // Lấy id từ URL
  const { status } = req.body; // Lấy status từ body request

  let sql = 'UPDATE article SET status = ? WHERE article_id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows > 0) {
      return res.json({ message: 'Cập nhật trạng thái thành công', status: 1 });
    } else {
      return res.json({ message: 'Cập nhật trạng thái thất bại', status: 0 });
    }
  });
});
// API GET ARTICLE CỤ THỂ BY ID
app.get('/api/article/getArticleCuTheById/:id', (req, res) => {
  let id = req.params.id; // Đảm bảo lấy đúng giá trị id từ params
  let sql = 'SELECT * FROM article WHERE article_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(result);
  });
});
// API GET ARTICLE TAG BY ID
app.get('/api/article/getArticletTagCuTheById/:id', (req, res) => {
  let id = req.params.id; // Đảm bảo lấy đúng giá trị id từ params
  let sql = 'SELECT * FROM article_tag WHERE article_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(result);
  });
});
// API UPDATE ARTICLE WITH TAGS
app.put('/api/article/update/:id', uploadThumbnail.single('thumbnail'), (req, res) => {
  const articleId = req.params.id;
  const { title, content, author_id, category_id, status, tags } = req.body;

  console.log('Received PUT request for article update:', articleId);

  // Check if a new thumbnail image is provided and save it
  const imageFileNameThumbnail = req.file ? req.file.filename : null;
  let imageNameThumbnail;
  if (imageFileNameThumbnail) {
    console.log('New thumbnail provided:', imageFileNameThumbnail);
    // Delete the old thumbnail image from storage
    const oldThumbnailSql = 'SELECT thumbnail_url FROM article WHERE article_id = ?';

    db.promise().query(oldThumbnailSql, [articleId])
      .then(([oldThumbnailResults]) => {
        const oldThumbnailPath = oldThumbnailResults[0]?.thumbnail_url;
        if (oldThumbnailPath) {
          const oldFilePath = path.join(__dirname, 'webtintuc/src/assets/thumbnail', oldThumbnailPath);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.warn(`Failed to delete old thumbnail: ${oldFilePath}`);
            } else {
              console.log(`Old thumbnail deleted: ${oldFilePath}`);
            }
          });
        }
      })
      .catch(err => console.error('Error fetching old thumbnail path:', err));

    imageNameThumbnail = imageFileNameThumbnail; // Assign the new file name to store in DB
  }

  // Process and update images in the description
  let imageUrls = [];
  const regex = /data:image\/([a-zA-Z]*);base64,([^\"]*)/g;
  const processedContent = content.replace(regex, (match, p1, p2) => {
    const fileName = `${uuidv4()}.${p1}`;
    const filePath = path.join(__dirname, 'webtintuc/src/assets/img_article', fileName);

    const base64Data = Buffer.from(p2, 'base64');
    fs.writeFileSync(filePath, base64Data);

    imageUrls.push(`http://localhost:3000/img_article/${fileName}`);
    return `http://localhost:3000/img_article/${fileName}`;
  });

  console.log('Processed content:', processedContent);

  // Get old images from the article to delete those that were removed
  const oldContentSql = 'SELECT content FROM article WHERE article_id = ?';
  db.promise().query(oldContentSql, [articleId])
    .then(([oldContentResults]) => {
      const oldContent = oldContentResults[0]?.content || '';
      const oldImageUrls = [...oldContent.matchAll(/http:\/\/localhost:3000\/img_article\/[^\"]+/g)].map(match => match[0]);

      // Identify images to delete (old images not in the new content)
      const imagesToDelete = oldImageUrls.filter(url => !processedContent.includes(url));
      imagesToDelete.forEach((imgPath) => {
        const localPath = imgPath.replace('http://localhost:3000/img_article/', path.join(__dirname, 'webtintuc/src/assets/img_article/'));
        fs.unlink(localPath, (err) => {
          if (err) {
            console.warn(`Failed to delete image: ${localPath}`);
          } else {
            console.log(`Image deleted: ${localPath}`);
          }
        });
      });

      console.log('Images to delete:', imagesToDelete);
    })
    .catch(err => console.error('Error fetching old content:', err));

  // Update article in the database
  const sql = `
    UPDATE article 
    SET title = ?, content = ?, author_id = ?, category_id = ?, status = ?, 
        thumbnail_url = ?, updated_at = ? 
    WHERE article_id = ?`;
  const now = new Date();
  db.promise().query(sql, [title, processedContent, author_id, category_id, status, imageNameThumbnail, now, articleId])
    .then(() => {
      console.log('Article updated successfully.');

      // Update tags if any were provided
      if (tags && tags.length > 0) {
        const deleteOldTagsSql = 'DELETE FROM article_tag WHERE article_id = ?';
        db.promise().query(deleteOldTagsSql, [articleId]);

        const tagInsertSql = 'INSERT INTO article_tag (article_id, tag_id) VALUES ?';
        const tagValues = tags.map(tagId => [articleId, tagId]);
        db.promise().query(tagInsertSql, [tagValues]);

        console.log('Tags updated:', tagValues);
      }

      res.json({ message: 'Cập nhật bài viết thành công', status: 1 });
    })
    .catch(err => {
      console.error('Error updating article:', err);
      res.status(500).json({ message: err.message });
    });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Đặt thư mục lưu trữ các tệp tải lên
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API UPDATE ARTICLE NO THUMBNAIL
app.put('/api/article/updateNoThumbnail/:id',upload.none(), (req, res) => {
  const articleId = req.params.id;
  const { title, content, author_id, category_id, status, tags } = req.body;

  console.log('Received PUT request for article update:', articleId);

  // Check if a new thumbnail image is provided and save it

  // Process and update images in the description
  let imageUrls = [];
  const regex = /data:image\/([a-zA-Z]*);base64,([^\"]*)/g;
  const processedContent = content.replace(regex, (match, p1, p2) => {
    const fileName = `${uuidv4()}.${p1}`;
    const filePath = path.join(__dirname, 'webtintuc/src/assets/img_article', fileName);

    const base64Data = Buffer.from(p2, 'base64');
    fs.writeFileSync(filePath, base64Data);

    imageUrls.push(`http://localhost:3000/img_article/${fileName}`);
    return `http://localhost:3000/img_article/${fileName}`;
  });

  console.log('Processed content:', processedContent);

  // Get old images from the article to delete those that were removed
  const oldContentSql = 'SELECT content FROM article WHERE article_id = ?';
  db.promise().query(oldContentSql, [articleId])
    .then(([oldContentResults]) => {
      const oldContent = oldContentResults[0]?.content || '';
      const oldImageUrls = [...oldContent.matchAll(/http:\/\/localhost:3000\/img_article\/[^\"]+/g)].map(match => match[0]);

      // Identify images to delete (old images not in the new content)
      const imagesToDelete = oldImageUrls.filter(url => !processedContent.includes(url));
      imagesToDelete.forEach((imgPath) => {
        const localPath = imgPath.replace('http://localhost:3000/img_article/', path.join(__dirname, 'webtintuc/src/assets/img_article/'));
        fs.unlink(localPath, (err) => {
          if (err) {
            console.warn(`Failed to delete image: ${localPath}`);
          } else {
            console.log(`Image deleted: ${localPath}`);
          }
        });
      });

      console.log('Images to delete:', imagesToDelete);
    })
    .catch(err => console.error('Error fetching old content:', err));

  // Update article in the database
  const sql = `
    UPDATE article 
    SET title = ?, content = ?, author_id = ?, category_id = ?, status = ?, 
         updated_at = ? 
    WHERE article_id = ?`;
  const now = new Date();
  db.promise().query(sql, [title, processedContent, author_id, category_id, status, now, articleId])
    .then(() => {
      console.log('Article updated successfully.');

      // Update tags if any were provided
      if (tags && tags.length > 0) {
        const deleteOldTagsSql = 'DELETE FROM article_tag WHERE article_id = ?';
        db.promise().query(deleteOldTagsSql, [articleId]);

        const tagInsertSql = 'INSERT INTO article_tag (article_id, tag_id) VALUES ?';
        const tagValues = tags.map(tagId => [articleId, tagId]);
        db.promise().query(tagInsertSql, [tagValues]);

        console.log('Tags updated:', tagValues);
      }

      res.json({ message: 'Cập nhật bài viết thành công', status: 1 });
    })
    .catch(err => {
      console.error('Error updating article:', err);
      res.status(500).json({ message: err.message });
    });
});


//API GET ALL ARTICLE BY ADMIN
app.get('/api/article/getAll', (req, res) => {
  let id = req.params.id;
  let sql = `
  SELECT article_id, title, content, author_id, article.category_id, 
         category.status AS cate_status, article.status AS article_status, 
         category.category_name, thumbnail_url
  FROM article 
  INNER JOIN category ON article.category_id = category.category_id 
  AND article.status IN ('choduyet', 'bigo', 'daduyet')
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(result);
  })
})

// FILTER ARTICLE ADMIN
app.get('/api/article/filterMyArticle2/:name/:category/:status', (req, res) => {
  let name = req.params.name;
  let category = req.params.category;
  let status = req.params.status;

  let sql = `
  SELECT article_id, title, content, author_id, article.category_id, 
         category.status AS cate_status, article.status AS article_status, 
         category.category_name, thumbnail_url
  FROM article 
  INNER JOIN category ON article.category_id = category.category_id 
`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    let filtered = [];
    if (result.length === 0) {
      return res.json(result);
    } else {
      filtered = result.filter(article => (
        (name === 'all' || article.title.toLowerCase().includes(name)) &&
        (category === 'all' || article.category_name.toLowerCase().includes(category)) &&
        (status === 'all' || article.article_status === status)
      ));
      return res.json(filtered);
    }
  })
})
// API GET ALL TAGS USER
app.get('/api/tag/:status', (req, res) => {
  let status = req.params.status;
  let sql = 'SELECT * FROM tag where status = ?';
  db.query(sql, [status], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      return res.json(result);
    }
  });
});
// API GET ALL CATEGORIES
app.get('/api/category/:status', (req, res) => {
  let status = req.params.status;
  let sql = 'select * from category where status= ?';
  db.query(sql, [status], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      return res.json(result);
    }
  })
})
// API GET ALL ARTICLE
app.get('/api/article/:status', (req, res) => {
  let status = req.params.status;
  const sql = `
    SELECT 
      article_id, 
      title, 
      content, 
      article.author_id, 
      article.category_id, 
      category.status AS cate_status, 
      article.status AS article_status, 
      category.category_name, 
      thumbnail_url,
      published_at
    FROM article 
    INNER JOIN category ON article.category_id = category.category_id 
    WHERE article.status = ?`;

  db.query(sql, [status], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ result });

  })
})
// GET ARTICLE BY ID
app.get('/api/article/getArticleById/:id', (req, res) => {
  let id = req.params.id; // Đảm bảo lấy đúng giá trị id từ params
  let sql = ` SELECT 
      article_id, 
      title, 
      content, 
      article.author_id, 
      article.category_id, 
      category.status AS cate_status, 
      article.status AS article_status, 
      category.category_name, 
      thumbnail_url,
      published_at,
      user.username as tentacgia
    FROM article 
    INNER JOIN category ON article.category_id = category.category_id 
    INNER JOIN user on user.user_id=article.author_id
	WHERE article_id=?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(result);
  });
});
// API GET ARTICLE TAGS NAME
app.get('/api/article/getArticletTagById/:id', (req, res) => {
  let id = req.params.id; // Đảm bảo lấy đúng giá trị id từ params
  let sql = ` SELECT * FROM article_tag INNER JOIN tag ON tag.tag_id=article_tag.tag_id  WHERE article_id = ? 
`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(result);
  });
});
// API GET ALL ARTICLE WHERE STATUS =' DADUYET ' AND CATEGORY = ?
app.get('/api/articleCate/:id', (req, res) => {
  let id = req.params.id;
  const sql = `
    SELECT 
      article_id, 
      title, 
      content, 
      article.author_id, 
      article.category_id, 
      category.status AS cate_status, 
      article.status AS article_status, 
      category.category_name, 
      thumbnail_url,
      published_at
    FROM article 
    INNER JOIN category ON article.category_id = category.category_id 
    WHERE article.status = 'daduyet' and  article.category_id = ? `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ result });

  })
})
// API GET ALL ARTICLE WHERE STATUS =' DADUYET ' AND tag_id = ?
app.get('/api/articleTag/:id', (req, res) => {
  let id = req.params.id;
  const sql = `
    SELECT 
      article.article_id, 
      title, 
      content, 
      article.author_id, 
      article.category_id, 
      category.status AS cate_status, 
      article.status AS article_status, 
      category.category_name, 
      thumbnail_url,
      published_at
    FROM article 
    INNER JOIN article_tag on article_tag.article_id=article.article_id
    INNER JOIN category ON article.category_id = category.category_id 
    WHERE article.status = 'daduyet' and  article_tag.tag_id= ? `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ result });

  })
})