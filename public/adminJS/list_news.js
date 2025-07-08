// JavaScript xử lý lọc và sắp xếp bài viết
document.getElementById('category-filter').addEventListener('change', function() {
  filterArticles();
});

document.getElementById('sort-order').addEventListener('change', function() {
  filterArticles();
});

function filterArticles() {
  const category = document.getElementById('category-filter').value;
  const sortOrder = document.getElementById('sort-order').value;

  // Giả lập dữ liệu bài viết
  const articles = [
    { title: "Tin tức 1", category: "tin-tuc", date: "2025-07-01" },
    { title: "Sự kiện 1", category: "su-kien", date: "2025-06-30" },
    { title: "Hoạt động 1", category: "hoat-dong", date: "2025-07-02" },
  ];

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

  // Hiển thị bài viết
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = "";
  filteredArticles.forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');
    articleDiv.innerHTML = `<h3 class="font-bold">${article.title}</h3><p>${article.date}</p>`;
    newsList.appendChild(articleDiv);
  });
}

// Gọi hàm lọc khi tải trang
filterArticles();
