
/////////////////////////////////////////////cod menu/////////////////////////////////////////////////////////////


document.getElementById("menuBtn").addEventListener("click", (event) => {
    let menu = document.getElementById("customMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
    event.stopPropagation(); // Ngăn chặn sự kiện lan ra ngoài
});

// Ẩn menu khi click ra ngoài
document.addEventListener("click", (event) => {
    let menu = document.getElementById("customMenu");
    if (!menu.contains(event.target) && event.target.id !== "menuBtn") {
        menu.style.display = "none";
    }
});

// Hàm đóng menu sau khi nhấn vào bất kỳ nút nào trong menu
function closeMenu() {
    document.getElementById("customMenu").style.display = "none";
}

// Gán sự kiện cho từng nút trong menu và đóng menu sau khi click
document.getElementById("reloadPanel").addEventListener("click", () => {
    location.reload();
    closeMenu();
});

// document.getElementById("settings").addEventListener("click", () => {
//     console.log("Opening settings...");
//     closeMenu();
// });


// document.getElementById("run_xoa_active").addEventListener("click", () => {
//     xoa_active();
//     closeMenu();
// });

document.getElementById("runDatatypo").addEventListener("click", () => {
    Run_jsx_cache("datatypo", datatypo_data);
    closeMenu();
});


//////////////////////////////////////////logout tab /////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    function toggleTab(tabId, buttonId) {
        let tabButton = document.querySelector(`[data-tab="${tabId}"]`); // Nút menu tab
        let tabPage = document.getElementById(tabId); // Nội dung tab
        let button = document.getElementById(buttonId); // Nút logout/login

        if (!tabButton || !tabPage || !button) {
            console.error(`Không tìm thấy tab hoặc nút: ${tabId}`);
            return;
        }

        // Kiểm tra trạng thái hiện tại và thay đổi tương ứng
        if (tabPage.style.display === "none") {
            console.log(`Logging in ${tabId}...`);
            tabButton.style.display = "flex";
            tabPage.style.display = "block";
            button.textContent = `Logout ${buttonId.replace("logout", "")}`;
        } else {
            console.log(`Logging out ${tabId}...`);
            tabButton.style.display = "none";
            tabPage.style.display = "none";
            button.textContent = `Login ${buttonId.replace("logout", "")}`;
        }

        adjustTabSize(); // Cập nhật kích thước nút sau khi ẩn hiện
        closeMenu(); // Đóng menu ngay sau khi ấn nút
    }

    function closeMenu() {
        let menu = document.getElementById("menu"); // Giả sử ID của menu là "menu"
        if (menu) {
            menu.style.display = "none"; // Đóng menu
            console.log("Menu đã đóng.");
        } else {
            console.error("Không tìm thấy menu để đóng.");
        }
    }

    function adjustTabSize() {
        let container = document.querySelector("sp-top-nav"); // Phần chứa các tab
        let tabs = document.querySelectorAll(".tab-link"); // Tất cả tab
        let visibleTabs = Array.from(tabs).filter(tab => tab.style.display !== "none");
        let totalTabs = visibleTabs.length;

        if (totalTabs === 0) return;

        let newWidth = 270 * (3 / totalTabs); // Cập nhật chiều rộng dựa vào số tab còn lại

        visibleTabs.forEach(tab => {
            tab.style.width = `${newWidth}px`;
        });
    }

    // Gán sự kiện cho từng nút logout/login
    document.getElementById("logoutTab1").addEventListener("click", () => toggleTab("tab-1", "logoutTab1"));
    document.getElementById("logoutTab2").addEventListener("click", () => toggleTab("tab-2", "logoutTab2"));
    document.getElementById("logoutTab3").addEventListener("click", () => toggleTab("tab-3", "logoutTab3"));

    // Thiết lập trạng thái ban đầu của các tab
    ["tab-1", "tab-2", "tab-3"].forEach(tabId => {
        let tab = document.getElementById(tabId);
        let tabButton = document.querySelector(`[data-tab="${tabId}"]`);
        let button = document.getElementById(`logout${tabId.replace("tab-", "Tab")}`);

        if (tab && tabButton && button) {
            tab.style.display = "block";
            tabButton.style.display = "flex";
            button.textContent = `Logout Tab${tabId.replace("tab-", "")}`;
        }
    });

    adjustTabSize();
});


/////////////////////////////////////////ngon ngu ////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.getElementById("toggleLanguage");
    const menu = document.getElementById("customMenu");
    const menuBtn = document.getElementById("menuBtn");
    const savedLang = localStorage.getItem("selectedLanguage") || "vi";

    updateLanguage(savedLang);

    // Gán sự kiện cho nút chuyển đổi ngôn ngữ
    langBtn.addEventListener("click", function () {
        const newLang = (localStorage.getItem("selectedLanguage") === "vi") ? "en" : "vi";
        setLanguage(newLang);
        closeMenu(); // Thêm đóng menu sau khi chuyển ngôn ngữ
    });

    // Đóng menu khi nhấn ra ngoài
    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && event.target !== menuBtn) {
            closeMenu();
        }
    });

    // Mở menu khi nhấn vào nút menu
    menuBtn.addEventListener("click", function () {
        menu.classList.toggle("menu-hidden");
    });

    // Thêm sự kiện click cho tất cả các nút trong menu
    document.querySelectorAll("#customMenu ul li").forEach(item => {
        item.addEventListener("click", () => {
            closeMenu();
        });
    });
});

// Hàm chuyển đổi ngôn ngữ
function setLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang);
    updateLanguage(lang);
    alert(`Language switched to ${lang === "en" ? "English" : "Tiếng Việt"}`);
    closeMenu(); // Đóng menu sau khi đổi ngôn ngữ
}

// Hàm cập nhật nội dung theo ngôn ngữ
function updateLanguage(lang) {
    const translations = {
        en: {

            copyright: "© Copyright Belongs to Van Retouch",
            tab_retouch: "Retouch",
            tab_passport: "Passport",
            tab_blend: "Blend",
             //////////menu
            toggleLanguage: "Vietnamese",
            reloadPanel: "Reload Panel",
            runDatatypo: "Datatypo",
            run_xoa_active: "Remove Key",
            settings: "background",
            logoutTab1: "Logout Tab1",
            logoutTab2: "Logout Tab2",
            logoutTab3: "Logout Tab3",
            //////1
            ai_light_dark: "AI Light & Dark",
            ai_spot_removal: "AI Spot Removal",
            ai_smooth_skin: "AI Smooth Skin",
            ai_smooth_skin_plus: "AI Smooth Skin+",
            ai_sharpen: "AI Sharpen",
            ai_batch: "AI Batch",
            frequency_separation: "Frequency Separation",
            light_dark_correction: "Light & Dark Correction",
            skin_error_check1: "Skin Error Check 1",
            skin_error_check2: "Skin Error Check 2",
            reduce_highlight: "Reduce Highlights",
            increase_shadow: "Increase Shadows",
            contrast_adjustment: "Adjust Contrast",
            color_adjustment: "Adjust Color",
            lip_beautify: "Lip Beautify",
            eyelash_beautify: "Eyelash Beautify",
            teeth_whitening: "Teeth Whitening",
            eye_beautify: "Eye Beautify",
            image_clarity: "Enhance Clarity",
            save_image: "Save Image",
            /////////////2
            resize_image: "Resize Image",
            crop_image: "Crop Image",
            remove_bg: "Remove Background",
            arrange_2x3: "Arrange 2x3",
            arrange_3x4: "Arrange 3x4",
            arrange_4x6: "Arrange 4x6",
            edit_colors: "Edit Colors",
            edit_face: "Edit Face",
            adjust_contrast: "Adjust Contrast",
            enhance_clarity: "Enhance Clarity",
            filter_image: "Filter Image",
            save_image: "Save Image",
            shirt_male: "Men's Shirt",
            vest_male: "Men's Vest",
            shirt_female: "Women's Shirt",
            vest_female: "Women's Vest",
            shirt_boy: "Boy's Shirt",
            shirt_girl: "Girl's Shirt",
            traditional_dress: "Áo Dài (Traditional Dress)",
            uniform: "Uniform",
            ///////////////3




        },
        vi: {
            
            copyright: "© Bản Quyền Thuộc Về Van Retouch",
            tab_retouch: " Chỉnh Ảnh ",
            tab_passport: "Ảnh thẻ",
            tab_blend: " Chỉnh  Màu",
            //////menu
            toggleLanguage: "English",
            reloadPanel: "Tải lại bảng",
            runDatatypo: "Datatypo",
            run_xoa_active: "Xóa key",
            settings: "Hình Nền",
            logoutTab1: "Đăng xuất Tab1",
            logoutTab2: "Đăng xuất Tab2",
            logoutTab3: "Đăng xuất Tab3",
             /////////////////1
            ai_light_dark: "Sáng Tối A.I",
            ai_spot_removal: "Nhặt Mụn A.I",
            ai_smooth_skin: "Mịn Da A.I",
            ai_smooth_skin_plus: "Mịn Da A.I+",
            ai_sharpen: "Nét Ảnh A.I",
            ai_batch: "A.I Hàng Loạt",
            frequency_separation: "Tách Tần Số",
            light_dark_correction: "Xử Lý Sáng Tối",
            skin_error_check1: "Kiểm Tra Lỗi Da 1",
            skin_error_check2: "Kiểm Tra Lỗi Da 2",
            reduce_highlight: "Giảm Vùng Sáng",
            increase_shadow: "Tăng Vùng Tối",
            contrast_adjustment: "Chỉnh Tương Phản",
            color_adjustment: "Chỉnh Màu Sắc",
            lip_beautify: "Làm Đẹp Môi",
            eyelash_beautify: "Làm Đẹp Mi",
            teeth_whitening: "Làm Đẹp Răng",
            eye_beautify: "Làm Đẹp Mắt",
            image_clarity: "Làm Trong Ảnh",
            save_image: "Lưu Ảnh",
            ////////////2
            resize_image: "Chỉnh size Ảnh",
            crop_image: "Cắt Ảnh",
            remove_bg: "Tách Nền Ảnh",
            arrange_2x3: "Xếp Ảnh 2x3",
            arrange_3x4: "Xếp Ảnh 3X4",
            arrange_4x6: "Xếp Ảnh 4X6",
            edit_colors: "Chỉnh Sửa Màu Sắc",
            edit_face: "Chỉnh Sửa Khuôn Mặt",
            adjust_contrast: "Chỉnh Tương Phản",
            enhance_clarity: "Làm Trong Ảnh",
            filter_image: "Lọc Ảnh",
            save_image: "Lưu Ảnh",
            shirt_male: "Áo Sơ mi Nam",
            vest_male: "Áo Vest Nam",
            shirt_female: "Áo Sơ Mi Nữ",
            vest_female: "Áo Vest Nữ",
            shirt_boy: "Áo Bé Trai",
            shirt_girl: "Áo Bé Gái",
            traditional_dress: "Áo Dài",
            uniform: "Quân Phục",
            //////////////////3






        }
    };

    // Cập nhật nội dung nút chuyển đổi ngôn ngữ
    document.getElementById("toggleLanguage").innerText = translations[lang]["toggleLanguage"];

    // Cập nhật nội dung menu theo ngôn ngữ
    document.querySelectorAll("#customMenu ul li").forEach((el) => {
        const key = el.id;
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Cập nhật nội dung các nút trên giao diện
    document.querySelectorAll("[data-lang]").forEach((el) => {
        const key = el.getAttribute("data-lang");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}

