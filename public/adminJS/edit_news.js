const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'times', 'roboto', 'mono', 'serif', 'sans'];
Quill.register(Font, true);

const quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Nhập nội dung bài viết...',
  modules: {
    toolbar: [
      [{ font: ['arial', 'times', 'roboto', 'mono', 'serif', 'sans'] }, { size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }
});
// Các input và vùng preview
const titleInput = document.getElementById('title');
const thumbInput = document.getElementById('thumbnail');
const previewTitle = document.getElementById('preview-title');
const previewThumb = document.getElementById('preview-thumb');
const previewContent = document.getElementById('preview');
const newsList = document.getElementById('news-list');

// Giả lập dữ liệu bài viết
const articles = [
  { id: 1, title: "Tin tức 1", category: "tin-tuc", date: "2025-07-01", thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHe_y-QsrqJ90enIIZ1RHrBdQStU9Bv7osksP-Q4UdCqW7cDGeeXNxb9I&s", content: "Nội dung Tin tức 1" },
  { id: 2, title: "Sự kiện 1", category: "su-kien", date: "2025-06-30", thumbnail: "http://example.com/img2.jpg", content: "Nội dung Sự kiện 1" },
  { id: 3, title: "Hoạt động 1", category: "hoat-dong", date: "2025-07-02", thumbnail: "http://example.com/img3.jpg", content: "Nội dung Hoạt động 1" },
  { id: 4, title: "Tin tức 2", category: "tin-tuc", date: "2025-07-03", thumbnail: "http://example.com/img4.jpg", content: "Nội dung Tin tức 2" },
  { id: 5, title: "Sự kiện 2", category: "su-kien", date: "2025-07-05", thumbnail: "http://example.com/img5.jpg", content: "Nội dung Sự kiện 2" },
  { id: 6, title: "Hoạt động 2", category: "hoat-dong", date: "2025-06-29", thumbnail: "http://example.com/img6.jpg", content: "Nội dung Hoạt động 2" },
  { id: 7, title: "Tin tức 3", category: "tin-tuc", date: "2025-07-07", thumbnail: "http://example.com/img7.jpg", content: "Nội dung Tin tức 3" },
  { id: 8, title: "Hoạt động 3", category: "hoat-dong", date: "2025-06-28", thumbnail: "http://example.com/img8.jpg", content: "Nội dung Hoạt động 3" }
];

// Chọn bài viết và điền thông tin vào form chỉnh sửa
newsList.addEventListener('change', (event) => {
  const selectedId = event.target.value;
  const selectedArticle = articles.find(article => article.id == selectedId);

  if (selectedArticle) {
    // Điền dữ liệu vào form nhập (Bên trái)
    document.getElementById('title').value = selectedArticle.title;
    document.getElementById('thumbnail').value = selectedArticle.thumbnail;
    quill.root.innerHTML = selectedArticle.content;  // Quill editor cho nội dung

    // Điền dữ liệu vào phần xem trước (Bên phải)
    updatePreviewFromForm();
  }
});

// Lấy danh sách các bài viết đã đăng từ dữ liệu giả lập (5 bài mới nhất)
function fetchNews() {
  const articlesToShow = articles.slice(0, 5); // Hiển thị 5 bài mới nhất
  articlesToShow.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id; // Dùng ID để xác định bài viết
    option.textContent = item.title;
    newsList.appendChild(option);
  });
}

// Cập nhật bài viết
function updateNews() {
  const title = document.getElementById('title').value;
  const thumbnail = document.getElementById('thumbnail').value;
  const content = quill.root.innerHTML;
  const newsId = newsList.value;

  // Tìm bài viết cần cập nhật từ danh sách
  const articleIndex = articles.findIndex(article => article.id == newsId);
  if (articleIndex !== -1) {
    articles[articleIndex] = { id: newsId, title, thumbnail, content };
    document.getElementById('result').innerText = '✅ Cập nhật bài viết thành công!';
  } else {
    document.getElementById('result').innerText = '❌ Có lỗi khi cập nhật bài viết';
  }
}

// Hàm cập nhật phần xem trước từ form nhập
function updatePreviewFromForm() {
  const title = document.getElementById('title').value;
  const thumbnail = document.getElementById('thumbnail').value;
  const content = quill.root.innerHTML;

  // Cập nhật phần xem trước bên phải
  document.getElementById('preview-title').textContent = title;
  document.getElementById('preview-thumb').src = thumbnail;
  document.getElementById('preview').innerHTML = content;
}

// Lắng nghe sự thay đổi Tiêu đề và Ảnh đại diện
titleInput.addEventListener('input', () => {
  updatePreviewFromForm();
});

thumbInput.addEventListener('input', () => {
  updatePreviewFromForm();
});

// Lắng nghe sự thay đổi trong Quill editor
quill.on('text-change', () => {
  updatePreviewFromForm();
});

// JavaScript xử lý lọc bài viết cho chỉnh sửa
document.getElementById('category-filter').addEventListener('change', function() {
  filterArticles();
});

document.getElementById('sort-order').addEventListener('change', function() {
  filterArticles();
});

function filterArticles() {
  const category = document.getElementById('category-filter').value;
  const sortOrder = document.getElementById('sort-order').value;

  // Lọc dữ liệu
  let filteredArticles = articles.filter(article => {
    return (category === "" || article.category === category);
  });

  // Sắp xếp dữ liệu
  if (sortOrder === "newest") {
    filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Reset dropdown và hiển thị các bài viết sau khi lọc
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '<option value="">Chọn tin tức</option>'; // Reset dropdown

  // Hiển thị tất cả các bài viết phù hợp với tiêu chí lọc
  filteredArticles.forEach(article => {
    const option = document.createElement('option');
    option.value = article.id;
    option.textContent = article.title;
    newsList.appendChild(option);
  });

  // Cập nhật phần xem trước bên phải
  updatePreviewFromForm();
}

// Gọi hàm lấy danh sách bài viết khi trang tải
window.onload = fetchNews;
