// Quill font settings
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'times', 'roboto', 'mono', 'serif', 'sans'];
Quill.register(Font, true);

// Khởi tạo Quill với toolbar đầy đủ
const quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Nhập nội dung sự kiện...',
  modules: {
    toolbar: [
      [{ font: Font.whitelist }, { size: ['small', false, 'large', 'huge'] }],
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
const dateInput = document.getElementById('event-date');
const timeInput = document.getElementById('event-time');
const locationInput = document.getElementById('event-location');
const thumbnailInput = document.getElementById('thumbnail');

const previewTitle = document.getElementById('preview-title');
const previewDateTime = document.getElementById('preview-datetime');
const previewLocation = document.getElementById('preview-location');
const previewThumb = document.getElementById('preview-thumb');
const previewContent = document.getElementById('preview-content');
const eventsList = document.getElementById('events-list');

// Giả lập dữ liệu sự kiện
const events = [
  { id: 1, title: "Sự kiện 1", category: "su-kien", date: "2025-07-01", time: "10:00", location: "Hà Nội", thumbnail: "https://via.placeholder.com/150", content: "Nội dung Sự kiện 1" },
  { id: 2, title: "Sự kiện 2", category: "su-kien", date: "2025-07-02", time: "14:00", location: "Hồ Chí Minh", thumbnail: "https://via.placeholder.com/150", content: "Nội dung Sự kiện 2" },
  { id: 3, title: "Hoạt động 1", category: "hoat-dong", date: "2025-07-02", time: "14:00", location: "Đà Nẵng", thumbnail: "https://via.placeholder.com/150", content: "Nội dung Hoạt động 1" },
  { id: 4, title: "Sự kiện 3", category: "su-kien", date: "2025-06-25", time: "09:00", location: "Hà Nội", thumbnail: "https://via.placeholder.com/150", content: "Nội dung Sự kiện 3" },
  { id: 5, title: "Hoạt động 2", category: "hoat-dong", date: "2025-06-30", time: "08:00", location: "Cần Thơ", thumbnail: "https://via.placeholder.com/150", content: "Nội dung Hoạt động 2" },
  { id: 6, title: "Hoạt động 3", category: "hoat-dong", date: "2025-07-10", time: "10:00", location: "Đà Nẵng", thumbnail: "https://via.placeholder.com/150", content: "Nội dung Hoạt động 3" },
  { id: 7, title: "Sự kiện 4", category: "su-kien", date: "2025-08-01", time: "18:00", location: "Hải Phòng", thumbnail: "https://via.placeholder.com/150", content: "Nội dung Sự kiện 4" }
];

// Lấy danh sách sự kiện và hiển thị lên dropdown
function fetchEvents() {
  const eventsToShow = events.slice(0, 5);  // Hiển thị tối đa 5 sự kiện
  eventsList.innerHTML = '<option value="">Chọn sự kiện</option>';  // Reset dropdown

  eventsToShow.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.title;
    eventsList.appendChild(option);
  });
}

// Cập nhật phần lọc sự kiện
document.getElementById('category-filter').addEventListener('change', function() {
  filterEvents();
});

document.getElementById('sort-order').addEventListener('change', function() {
  filterEvents();
});

function filterEvents() {
  const category = document.getElementById('category-filter').value;
  const sortOrder = document.getElementById('sort-order').value;

  // Lọc dữ liệu sự kiện theo category
  let filteredEvents = events.filter(event => {
    return (category === "" || event.category === category);
  });

  // Sắp xếp dữ liệu theo ngày
  if (sortOrder === "newest") {
    filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Reset dropdown và hiển thị các sự kiện sau khi lọc
  eventsList.innerHTML = '<option value="">Chọn sự kiện</option>';  // Reset dropdown

  filteredEvents.forEach(event => {
    const option = document.createElement('option');
    option.value = event.id;
    option.textContent = event.title;
    eventsList.appendChild(option);
  });

  // Cập nhật phần xem trước
  updatePreviewFromForm();
}

// Chọn sự kiện và điền thông tin vào form chỉnh sửa
eventsList.addEventListener('change', (event) => {
  const selectedId = event.target.value;
  const selectedEvent = events.find(event => event.id == selectedId);

  if (selectedEvent) {
    // Điền dữ liệu vào form nhập (Bên trái)
    document.getElementById('title').value = selectedEvent.title;
    document.getElementById('event-date').value = selectedEvent.date;
    document.getElementById('event-time').value = selectedEvent.time;
    document.getElementById('event-location').value = selectedEvent.location;
    document.getElementById('thumbnail').value = selectedEvent.thumbnail;
    quill.root.innerHTML = selectedEvent.content;

    // Cập nhật phần xem trước
    updatePreviewFromForm();
  }
});

// Hàm cập nhật phần xem trước từ form nhập
function updatePreviewFromForm() {
  previewTitle.textContent = titleInput.value;
  previewDateTime.textContent = `${dateInput.value} ${timeInput.value}`;
  previewLocation.textContent = locationInput.value;
  previewThumb.src = thumbnailInput.value;
  previewContent.innerHTML = quill.root.innerHTML;
}

// Lắng nghe sự thay đổi Tiêu đề, Địa điểm, Thời gian, Ảnh đại diện để cập nhật trực tiếp preview
titleInput.addEventListener('input', () => {
  updatePreviewFromForm();
});

dateInput.addEventListener('input', () => {
  updatePreviewFromForm();
});

timeInput.addEventListener('input', () => {
  updatePreviewFromForm();
});

locationInput.addEventListener('input', () => {
  updatePreviewFromForm();
});

thumbnailInput.addEventListener('input', () => {
  updatePreviewFromForm();
});

// Lắng nghe sự thay đổi trong Quill editor
quill.on('text-change', () => {
  updatePreviewFromForm();
});

// Cập nhật sự kiện
function updateEvent() {
  const eventData = {
    title: titleInput.value,
    date: dateInput.value,
    time: timeInput.value,
    location: locationInput.value,
    thumbnail: thumbnailInput.value,
    content: quill.root.innerHTML
  };

  // Tìm sự kiện cần cập nhật từ danh sách
  const eventIndex = events.findIndex(event => event.id == eventsList.value);
  if (eventIndex !== -1) {
    events[eventIndex] = { ...events[eventIndex], ...eventData };
    document.getElementById('result').innerText = '✅ Cập nhật sự kiện thành công!';
    updatePreviewFromForm();
  } else {
    document.getElementById('result').innerText = '❌ Có lỗi khi cập nhật sự kiện';
  }
}

// Gọi hàm lấy danh sách sự kiện khi trang tải
window.onload = fetchEvents;
