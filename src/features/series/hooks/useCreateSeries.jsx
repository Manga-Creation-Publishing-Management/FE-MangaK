import { useEffect, useRef, useState } from "react";
// import { get, post } from "../../shared/requests";
import { api } from "../../../services/api";
import { seriesService } from "../../../services/seriesService";
import { useToast } from "../../../shared/hooks/useToast";
import ReactCropper from "react-cropper";


// Custom hook quản lý trạng thái và logic cho form tạo mới bộ truyện (Create Series)
export default function useCreateSeries(onClose, onReload, reloadState) {
  const { showAlert } = useToast();

  // State lưu danh sách thể loại lấy từ API
  const [genreList, setGenreList] = useState([]);
  // State mảng chứa ID của các thể loại người dùng đã chọn
  const [selectGenres, setSelectGenres] = useState([]);
  // State lưu trữ dữ liệu các ô text trong form (như title, description)
  const [formSeriesData, setFormSeriesData] = useState({});

  // State quản lý trạng thái loading (khi đang gọi API submit)
  const [isLoading, setIsLoading] = useState(false);

  // State lưu file ảnh bìa (Cover) và file truyện (Story/Draft)
  const [coverFile, setCoverFile] = useState(null);
  const [storyFile, setStoryFile] = useState(null);

  // Reference trỏ tới thẻ <input type="file"> để kích hoạt click bằng code
  const coverInputRef = useRef(null);
  const storyInputRef = useRef(null);

  const [image, setImage] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const cropperRef = useRef(null);

  // useEffect gọi API để lấy danh mục thể loại và danh sách truyện 
  // Mỗi khi reloadState thay đổi (ví dụ có sự kiện thêm mới), nó sẽ fetch lại data
  useEffect(() => {
    const fetchApi = async () => {
      // Chờ gọi 2 API lấy thể loại và series
      const resultsGenre = await seriesService.getAllCategory();

      // Cập nhật state
      setGenreList(resultsGenre.data);
    };
    fetchApi();
  }, [reloadState])

  // Hàm xử lý khi người dùng chọn/bỏ chọn một thể loại (tag)
  const handleActive = (genreId) => {
    if (selectGenres.includes(genreId)) {
      // Nếu đã chọn rồi -> bỏ chọn (xóa khỏi mảng)
      setSelectGenres(selectGenres.filter(id => id !== genreId))
    } else {
      // Nếu chưa chọn -> thêm vào mảng
      setSelectGenres([...selectGenres, genreId]);
    }
  }

  // Hàm xử lý khi người dùng gõ vào các ô input text (title, description)
  const handleChange = (e) => {
    const name = e.target.name;   // Tên của ô input (thuộc tính name)
    const value = e.target.value; // Giá trị mới người dùng vừa gõ
    setFormSeriesData({
      ...formSeriesData, // Giữ lại các giá trị cũ
      [name]: value,     // Cập nhật/thêm giá trị mới
    })
  }

  // Hàm xử lý lưu file ảnh bìa sau khi người dùng chọn
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Hàm xử lý lưu file nội dung truyện (bản draft) sau khi người dùng chọn
  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoryFile(e.target.files[0]);
    }
  };
  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas({
      width: 900,
      height: 1200,
      fillColor: "#fff",
    }).toBlob((blob) => {
      const file = new File([blob], "cover-cropped.jpg", {
        type: "image/jpeg",
      });
      setCroppedFile(file);
      setCoverFile(file);
      // setImage("");
      showAlert("Cropped successfully!");
    }, "image/jpeg");
  };

  // Hàm xử lý khi form được submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn việc reload trang
    setIsLoading(true); // Bật trạng thái loading

    // Tạo đối tượng FormData để chứa dữ liệu text và file
    const formData = new FormData();

    // Duyệt qua tất cả các key trong formSeriesData để thêm vào formData
    Object.keys(formSeriesData).forEach((key) => {
      formData.append(key, formSeriesData[key]);
    });

    // Thêm mảng categoryIds (chọn nhiều thể loại thì append nhiều lần cùng 1 key)
    if (selectGenres && selectGenres.length > 0) {
      selectGenres.forEach((id) => {
        formData.append("CategoryIds", id);
      });
    }

    // Nếu có chọn file thì mới đưa vào formData
    if (croppedFile) formData.append("coverFile", croppedFile); // File ảnh thật
    if (storyFile) formData.append("nameFile", storyFile);  // File truyện thật

    try {
      // Gọi API createSeries từ service
      const results = await seriesService.createSeries(formData);

      if (results) {
        showAlert("Created successfully!");
        // Chờ 0.5s rồi gọi onClose và onReload để đóng form và tải lại trang
        setTimeout(() => {
          onClose();
          onReload();
        }, 0);
      }
    } catch (error) {
      // Ghi log nếu xảy ra lỗi trong quá trình tạo
      console.log("Error tại hook:", error);
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  // Trả về tất cả các biến và hàm cần thiết để form (CreateSeriesModal) sử dụng
  return {
    genreList,
    selectGenres,
    coverFile,
    storyFile,
    coverInputRef,
    storyInputRef,
    formSeriesData,
    handleActive,
    handleChange,
    handleCoverChange,
    handleStoryChange,
    handleSubmit,
    getCroppedImage,
    cropperRef,
    image
  };

}