/**
 * ============================================================================
 * MAIN APPLICATION LOGIC
 * 1st Anniversary Web - Couple Universe Controller
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. DEFAULT DATA CONFIGURATION
  const DEFAULT_CONFIG = {
    partner1: 'Anh',
    partner2: 'Em',
    // Exactly 1 year ago relative to Oct 21, 2026:
    startDate: '2025-10-21',
    milestones: [
      {
        id: 1,
        planetName: 'Hành Tinh Trang Sách',
        title: 'Chuyện Tình Bắt Đầu Từ Cuốn Sách',
        date: 'Ngày Đầu Gặp Gỡ',
        image: 'assets/milestone_1.jpg',
        caption: 'Một tin nhắn hỏi mua sách, một định mệnh trăm năm...',
        story: 'Ai ngờ được một tin nhắn hỏi mua sách bâng quơ trên mạng xã hội lại là mở đầu cho cả một câu chuyện tình yêu tuyệt đẹp. Ngày đầu tiên qua trực tiếp gặp em để lấy sách, đứng trước cửa tim anh đập thình thịch vì hồi hộp. Đến khi nhìn thấy nụ cười bỡ ngỡ của em, anh đã biết cuốn sách quý giá nhất mà anh tìm được chính là em.',
        quote: 'Vũ trụ bao la đã khéo léo dùng một cuốn sách để đưa bước chân hai ta chạm vào nhau.',
        feeling: 'Hồi hộp & Ngại ngùng',
        location: 'Buổi Hẹn Đầu Nhận Sách',
        atmosphereType: 'book_pages',
        atmosphereName: '📚 Trang Sách & Ánh Sao',
        secretMessage: 'Hôm ấy anh giả vờ hỏi mua sách thôi, chứ thực ra là muốn tìm cớ để được gặp em đấy! 🤫❤️',
      },
      {
        id: 2,
        planetName: 'Hành Tinh Chiếc Lắc Tay',
        title: 'Chiếc Lắc Tay & Buổi Hẹn Cà Phê',
        date: 'Kỷ Niệm Khắc Ghi',
        image: 'assets/milestone_2.jpg',
        caption: 'Chiếc lắc tay nhỏ bé khẽ chạm vào cổ tay em...',
        story: 'Buổi hẹn hò cà phê ấm cúng hôm ấy, anh đã cẩn thận chọn chiếc vòng và lắc đeo tay xinh xắn nhất dành tặng em. Khoảnh khắc anh ngập ngừng lấy chiếc lắc tay ra rồi nhẹ nhàng đeo vào cổ tay nhỏ nhắn của em, từng ngón tay chạm khẽ làm tim anh rộn ràng. Chiếc lắc tay lấp lánh như một lời hứa bình yên anh dành riêng cho em.',
        quote: 'Chiếc lắc tay nhỏ bé trên cổ tay em, như một lời nguyện ước dịu dàng giữ chặt hai trái tim bên nhau.',
        feeling: 'Ấm áp & Rung động khôn nguôi',
        location: 'Quán Cà Phê Góc Quen',
        atmosphereType: 'gem_cafe',
        atmosphereName: '☕ Cà Phê & Lắc Pha Lê',
        secretMessage: 'Lúc cầm tay em để cài khóa lắc, tay anh run bần bật mà phải cố tỏ ra thật bình tĩnh đấy nhé! ☕💍',
      },
      {
        id: 3,
        planetName: 'Hành Tinh Đêm Giao Thừa',
        title: 'Lời Tỏ Tình Dưới Bầu Trời Giao Thừa',
        date: 'Đêm Giao Thừa Thiêng Liêng',
        image: 'assets/milestone_3.jpg',
        caption: 'Pháo hoa bừng sáng, em khẽ gật đầu...',
        story: 'Đêm giao thừa thiêng liêng nhất trong cuộc đời anh. Giữa biển người náo nức chờ đón năm mới, khi những chùm pháo hoa đầu tiên bừng sáng rực rỡ trên bầu trời đêm, anh đã lấy hết dũng khí của cả cuộc đời ghé sát tai em và nói: "Làm người yêu anh nhé!". Khoảnh khắc em mỉm cười và gật đầu e ấp, cả thế giới xung quanh anh như bừng sáng rực rỡ hơn bất kỳ màn pháo hoa nào.',
        quote: 'Thời khắc đất trời chuyển giao sang năm mới, điều may mắn và kỳ diệu nhất trần đời là có được cái gật đầu của em.',
        feeling: 'Hạnh phúc vỡ òa & Thiêng liêng',
        location: 'Khoảnh Khắc Giao Thừa',
        atmosphereType: 'fireworks_midnight',
        atmosphereName: '🎆 Pháo Hoa Giao Thừa',
        secretMessage: 'Trước giờ đếm ngược 10 phút, anh đã nhẩm đi nhẩm lại câu tỏ tình đến cả trăm lần trong đầu! 🎆❤️',
      },
      {
        id: 4,
        planetName: 'Hành Tinh Phố & Hồ Gươm',
        title: 'Rạp Phim Đầu Tiên & Vòng Xe Quanh Hồ Gươm',
        date: 'Ngày Hẹn Hò Trọn Vẹn',
        image: 'assets/milestone_4.jpg',
        caption: 'Một ngày rong ruổi khắp phố phường và vòng quanh Bờ Hồ...',
        story: 'Một ngày hẹn hò trọn vẹn và đáng nhớ nhất! Chúng mình cùng nhau đi công viên hóng gió, lần đầu tiên ngồi cạnh nhau trong rạp chiếu phim với gói bỏng ngô ngọt lịm. Rồi khi hoàng hôn buông xuống, hai đứa rong ruổi trên chiếc xe máy quanh từng con phố thân thương, dạo bước bên Hồ Gươm gió thổi mát rượi. Dù đi bộ bao nhiêu vòng quanh bờ hồ cũng không thấy mệt, chỉ mong thời gian trôi thật chậm lại.',
        quote: 'Đi đâu không quan trọng, chỉ cần trên yên xe phía sau là em, mọi con phố đều trở nên thơ mộng lạ thường.',
        feeling: 'Ngọt ngào & Tự do bay bổng',
        location: 'Rạp Phim & Hồ Gươm Lộng Gió',
        atmosphereType: 'hoan_kiem_autumn',
        atmosphereName: '🍂 Lá Vàng & Hồ Gươm',
        secretMessage: 'Lúc ngồi trong rạp chiếu phim, anh mải liếc nhìn góc nghiêng của em nhiều hơn là nhìn màn hình phim đấy! 🎬🍦',
      },
      {
        id: 5,
        planetName: 'Hành Tinh Cơm Nhà & Bếp Ấm',
        title: 'Những Bữa Cơm Tự Tay Anh Nấu Cho Em',
        date: 'Bình Yên Thường Nhật',
        image: 'assets/milestone_5.jpg',
        caption: 'Nấu những món em thích, ngắm em ăn thật ngon lành...',
        story: 'Chúng mình bắt đầu hẹn hò đi ăn nhiều hơn, nhưng khoảnh khắc anh trân quý nhất là những ngày anh tự tay vào bếp chuẩn bị bữa cơm cho em. Đi chợ chọn từng nguyên liệu em thích, nêm nếm thật cẩn thận, rồi hồi hộp chờ em nếm thử miếng đầu tiên. Nhìn thấy em ăn ngon lành và nở nụ cười rạng rỡ, mọi mệt mỏi trong anh đều tan biến hết. Hạnh phúc giản đơn chỉ là bữa cơm nhà có em bên cạnh.',
        quote: 'Hương vị ngọt ngào nhất trên thế gian không phải cao lương mỹ vị, mà là được tự tay nấu cho người mình yêu mỗi ngày.',
        feeling: 'Ấm áp gia đình & Bình yên',
        location: 'Căn Bếp Nhỏ Yêu Thương',
        atmosphereType: 'cozy_kitchen',
        atmosphereName: '🍳 Bếp Lửa Cơm Nhà',
        secretMessage: 'Chỉ cần em muốn ăn, bất kể món gì anh cũng sẽ học nấu để làm cho em ăn cả đời! 🍳🍚',
      },
      {
        id: 6,
        planetName: 'Hành Tinh 365 Ngày',
        title: 'Tròn 1 Năm - Vạn Dặm Tương Lai Cùng Em',
        date: '21/10/2026',
        image: 'assets/milestone_6.jpg',
        caption: 'Happy 1st Anniversary! 365 ngày trọn vẹn yêu thương.',
        story: 'Tròn 365 ngày kể từ ngày định mệnh ấy! Chúng mình đã cùng nhau đi qua 4 mùa: từ tin nhắn mua sách bỡ ngỡ, chiếc lắc tay kẹp quán cafe, lời tỏ tình thiêng liêng đêm giao thừa, những vòng xe quanh Hồ Gươm, cho đến những bữa cơm ấm áp thường ngày. 365 ngày qua là quãng thời gian hạnh phúc nhất trong đời anh. Cảm ơn em vì đã đến, đã luôn thấu hiểu, yêu thương và đồng hành cùng anh!',
        quote: '365 ngày vừa qua chỉ là chương mở đầu cho một câu chuyện tình yêu trăm năm hạnh phúc của hai chúng ta. Yêu em vô cùng! ❤️',
        feeling: 'Biết ơn & Yêu em tha thiết',
        location: 'Vũ Trụ Tình Yêu Của Đôi Mình',
        atmosphereType: 'anniversary_roses',
        atmosphereName: '🌹 Mưa Cánh Hoa Hồng & Vô Cực',
        secretMessage: 'Chúc mừng kỷ niệm 1 năm của chúng mình! Anh yêu công chúa của anh nhất trên đời, mãi mãi không đổi thay! 💍🌹✨',
      },
    ],
    bucketList: [
      { id: 1, text: 'Cùng nhau đón hoàng hôn ấm áp ở Đà Lạt 🌅', done: true },
      { id: 2, text: 'Cùng nhau đi xem một buổi concert thần tượng 🎶', done: false },
      { id: 3, text: 'Tự tay làm một chiếc bánh kem sinh nhật tặng nhau 🎂', done: false },
      { id: 4, text: 'Chụp một bộ ảnh thật lãng mạn dưới mưa 📸', done: false },
      { id: 5, text: 'Cùng nhau đi du lịch một vùng đất chưa từng đến ✈️', done: false },
      { id: 6, text: 'Cùng nhau xây dựng một tổ ấm ngập tràn tiếng cười 🏡💕', done: false }
    ],
    timeCapsule: {
      unlockDate: '2026-12-31T23:59',
      title: 'Bức Thư Gửi Em Vào Thời Khắc Giao Thừa',
      message: 'Nếu em đang đọc được bức thư này, nghĩa là chúng ta đã cùng nhau đi qua thêm một chặng đường tuyệt đẹp nữa. Cảm ơn em vì đã luôn ở bên cạnh anh, dịu dàng và ấm áp như ngày đầu tiên. Dù thời gian trôi qua bao lâu, tình yêu anh dành cho em vẫn vẹn nguyên như phút ban đầu! Yêu em vô cùng! ❤️',
      author: 'Anh'
    }
  };

  // State Management with LocalStorage & Auto-Migration
  let appData = loadSavedData();
  let currentMilestoneIndex = 0;
  let customAudioElement = null;
  let isCustomAudioPlaying = false;
  let isMainAudioPlaying = false;

  // Helper: Floating Sync Toast Notification
  function showSyncToast(msg) {
    let toast = document.getElementById('love-sync-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'love-sync-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(30px);
        background: linear-gradient(135deg, rgba(16, 42, 74, 0.95), rgba(8, 23, 44, 0.95));
        border: 1px solid rgba(114, 239, 221, 0.6);
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 30px;
        font-family: var(--font-sans);
        font-size: 0.92rem;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(114, 239, 221, 0.35);
        z-index: 99999;
        pointer-events: none;
        opacity: 0;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(30px)';
    }, 3200);
  }

  // Helper: Compress high-res phone photos to web-optimized JPEG using Canvas
  function compressImage(file, maxWidth = 1200, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxWidth || h > maxWidth) {
            if (w > h) {
              h = Math.round((h * maxWidth) / w);
              w = maxWidth;
            } else {
              w = Math.round((w * maxWidth) / h);
              h = maxWidth;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Multi-Device Photo Sync Upload
  async function uploadMilestonePhoto(milestoneId, dataUrl) {
    const idx = appData.milestones.findIndex(m => m.id === Number(milestoneId));
    if (idx === -1) return dataUrl;
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, imageBase64: dataUrl })
      });
      const json = await res.json();
      if (json.success && json.url) {
        appData.milestones[idx].image = json.url;
        appData.lastUpdated = json.lastUpdated || Date.now();
        persistData();
        showSyncToast('✨ Ảnh đã tải lên và tự động đồng bộ sang máy người yêu!');
        return json.url;
      }
    } catch (e) {
      console.warn('Server upload not reachable, saving locally:', e);
    }
    // Fallback for offline or static hosting
    appData.milestones[idx].image = dataUrl;
    appData.lastUpdated = Date.now();
    persistData();
    showSyncToast('✨ Đã lưu ảnh kỷ niệm!');
    return dataUrl;
  }

  function updateSyncBadge(isConnected) {
    const titleEl = document.getElementById('sync-status-title');
    const descEl = document.getElementById('sync-status-desc');
    const badgeEl = document.getElementById('sync-badge-icon');
    if (titleEl && descEl && badgeEl) {
      if (isConnected) {
        badgeEl.textContent = '🟢';
        titleEl.textContent = 'Neon Database Đã Kết Nối - Đồng Bộ Đám Mây 24/7';
        descEl.textContent = 'Mọi ảnh và thông tin của hai bạn được lưu an toàn trên Neon Cloud. Kể cả khi tắt máy tính, trang web vẫn đồng bộ thời gian thực!';
      } else {
        badgeEl.textContent = '☁️';
        titleEl.textContent = 'Chế độ lưu trữ cục bộ (Offline)';
        descEl.textContent = 'Đang lưu trữ trên thiết bị hiện tại.';
      }
    }
  }

  // Check and Sync data from Node.js server
  async function checkAndSyncServerData(isManual = false) {
    try {
      const res = await fetch('/api/data', { cache: 'no-cache' });
      if (!res.ok) throw new Error('API not available');
      const serverData = await res.json();
      updateSyncBadge(true);
      if (serverData && serverData.milestones && Array.isArray(serverData.milestones)) {
        const localUpdated = appData.lastUpdated || 0;
        const serverUpdated = serverData.lastUpdated || 0;
        if (serverUpdated > localUpdated || isManual) {
          if (!serverData.bucketList) serverData.bucketList = JSON.parse(JSON.stringify(DEFAULT_CONFIG.bucketList));
          if (!serverData.timeCapsule) serverData.timeCapsule = JSON.parse(JSON.stringify(DEFAULT_CONFIG.timeCapsule));
          appData = serverData;
          persistData();
          renderCoupleHeader();
          renderBottomTimeline();
          updateAnniversaryCounter();
          const bucketModal = document.getElementById('bucketlist-modal');
          if (bucketModal && bucketModal.classList.contains('open')) {
            renderBucketList();
          }
          // If planet modal is open, refresh image
          if (planetModal && planetModal.classList.contains('open') && appData.milestones[currentMilestoneIndex]) {
            const m = appData.milestones[currentMilestoneIndex];
            const imgEl = document.getElementById('modal-image');
            if (imgEl && m.image && imgEl.src !== m.image) imgEl.src = m.image;
          }
          if (isManual) showSyncToast('🔄 Đã đồng bộ dữ liệu mới nhất từ máy chủ!');
        }
      }
    } catch (err) {
      updateSyncBadge(false);
      if (isManual) showSyncToast('⚠️ Chưa kết nối được máy chủ đồng bộ.');
    }
  }

  function loadSavedData() {
    try {
      const savedStr = localStorage.getItem('love_anniversary_data_v2');
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        if (!parsed.bucketList || parsed.bucketList.length === 0) {
          parsed.bucketList = JSON.parse(JSON.stringify(DEFAULT_CONFIG.bucketList));
        }
        if (!parsed.timeCapsule) {
          parsed.timeCapsule = JSON.parse(JSON.stringify(DEFAULT_CONFIG.timeCapsule));
        }
        return parsed;
      }
      // Check legacy v1 key
      const legacy = localStorage.getItem('love_anniversary_data');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        // If legacy has old placeholder titles, migrate to user's real milestones
        if (parsed.milestones && parsed.milestones[0] && parsed.milestones[0].title === 'Lần Đầu Chạm Ánh Mắt') {
          const fresh = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
          fresh.partner1 = parsed.partner1 || 'Anh';
          fresh.partner2 = parsed.partner2 || 'Em';
          fresh.startDate = parsed.startDate || '2025-10-21';
          fresh.lastUpdated = Date.now();
          localStorage.setItem('love_anniversary_data_v2', JSON.stringify(fresh));
          return fresh;
        }
      }
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }
    const fresh = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    fresh.lastUpdated = Date.now();
    try {
      localStorage.setItem('love_anniversary_data_v2', JSON.stringify(fresh));
    } catch (e) {}
    return fresh;
  }

  function persistData() {
    try {
      localStorage.setItem('love_anniversary_data_v2', JSON.stringify(appData));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // DOM Elements
  const headerElem = document.getElementById('main-header');
  const coupleNamesElem = document.getElementById('couple-names-display');
  const introOverlay = document.getElementById('gift-intro-overlay');
  const btnOpenGift = document.getElementById('btn-open-gift');
  const bottomTimeline = document.getElementById('bottom-timeline');
  const timelineNodesList = document.getElementById('timeline-nodes-list');

  // Modals
  const planetModal = document.getElementById('planet-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnBackGalaxy = document.getElementById('btn-back-galaxy');
  const btnPrevMilestone = document.getElementById('btn-prev-milestone');
  const btnNextMilestone = document.getElementById('btn-next-milestone');
  const modalPhotoUpload = document.getElementById('modal-photo-upload');

  // Customizer Modal
  const editModal = document.getElementById('edit-modal');
  const btnEditMemories = document.getElementById('btn-edit-memories');
  const btnCloseEditModal = document.getElementById('btn-close-edit-modal');
  const editModalBackdrop = document.getElementById('edit-modal-backdrop');
  const btnSaveCustomizer = document.getElementById('btn-save-customizer');
  const btnResetDefault = document.getElementById('btn-reset-default');
  const btnResetBox = document.getElementById('btn-reset-box');

  // Tooltip
  const planetTooltip = document.getElementById('planet-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipDate = document.getElementById('tooltip-date');

  // Audio Controls
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  const customMusicInput = document.getElementById('custom-music-input');

  /* =========================================================================
     AUDIO CONTROLLER (SYNTHESIS & CUSTOM FILE)
     ========================================================================= */
  class LoveSoundtrack {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.timerId = null;
      this.step = 0;
      // Sweet romantic chords progression: Fmaj7 - Am7 - Dm7 - Bbmaj7 - C7sus4
      this.chords = [
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
        [440.00, 523.25, 659.25, 783.99], // Am7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [466.16, 587.33, 698.46, 880.00], // Bbmaj7
      ];
    }

    initContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, time, duration, gainLevel = 0.08) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(gainLevel, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    }

    start() {
      this.initContext();
      if (this.isPlaying) return;
      this.isPlaying = true;

      const scheduleNotes = () => {
        if (!this.isPlaying) return;
        const now = this.ctx.currentTime;
        const currentChord = this.chords[this.step % this.chords.length];

        // Play gentle arpeggiated notes
        currentChord.forEach((note, index) => {
          this.playTone(note, now + index * 0.45, 2.2, 0.06);
        });

        // Add soft high bell chime sparkle
        if (Math.random() > 0.4) {
          this.playTone(currentChord[currentChord.length - 1] * 1.5, now + 1.2, 1.8, 0.035);
        }

        this.step++;
        this.timerId = setTimeout(scheduleNotes, 2400);
      };

      scheduleNotes();
    }

    stop() {
      this.isPlaying = false;
      if (this.timerId) clearTimeout(this.timerId);
    }

    toggle() {
      if (this.isPlaying) {
        this.stop();
        return false;
      } else {
        this.start();
        return true;
      }
    }
  }

  const bgm = new LoveSoundtrack();
  const mainBgmAudio = document.getElementById('main-bgm-audio');

  function playBGM() {
    if (customAudioElement) {
      customAudioElement.play().then(() => {
        isCustomAudioPlaying = true;
        updateAudioButtonUI(true, 'Nhạc Của Bạn');
      }).catch(err => console.warn('Custom audio error:', err));
      return;
    }
    if (mainBgmAudio) {
      mainBgmAudio.volume = 0.85;
      mainBgmAudio.play().then(() => {
        isMainAudioPlaying = true;
        updateAudioButtonUI(true, 'tình yêu có nghĩa là gì? (tlinh)');
      }).catch((e) => {
        console.warn('Audio play restricted or failed, falling back to WebAudio synth:', e);
        bgm.start();
        updateAudioButtonUI(true, 'Nhạc Tình Ca');
      });
    } else {
      bgm.start();
      updateAudioButtonUI(true, 'Nhạc Tình Ca');
    }
  }

  function pauseBGM() {
    if (customAudioElement) {
      customAudioElement.pause();
      isCustomAudioPlaying = false;
    }
    if (mainBgmAudio) {
      mainBgmAudio.pause();
      isMainAudioPlaying = false;
    }
    bgm.stop();
    updateAudioButtonUI(false);
  }

  function toggleBGM() {
    if (isMainAudioPlaying || isCustomAudioPlaying || bgm.isPlaying) {
      pauseBGM();
    } else {
      playBGM();
    }
  }

  function updateAudioButtonUI(isPlaying, songName) {
    if (btnToggleSound) {
      if (isPlaying) {
        btnToggleSound.classList.add('playing');
        btnToggleSound.querySelector('.btn-text').textContent = songName ? `Đang Phát: ${songName}` : 'Đang Phát';
        if (soundIcon) soundIcon.textContent = '🎶';
      } else {
        btnToggleSound.classList.remove('playing');
        btnToggleSound.querySelector('.btn-text').textContent = 'Bật Nhạc';
        if (soundIcon) soundIcon.textContent = '🎵';
      }
    }
  }

  /* =========================================================================
     LIVE 365 DAYS ANNIVERSARY COUNTER
     ========================================================================= */
  function updateAnniversaryCounter() {
    const start = new Date(appData.startDate).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, now - start);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const elDays = document.getElementById('count-days');
    const elHours = document.getElementById('count-hours');
    const elMins = document.getElementById('count-mins');
    const elSecs = document.getElementById('count-secs');

    if (elDays) elDays.textContent = days;
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(mins);
    if (elSecs) elSecs.textContent = pad(secs);
  }

  // Update timer every second
  setInterval(updateAnniversaryCounter, 1000);

  /* =========================================================================
     UI RENDERERS & TIMELINE NODES
     ========================================================================= */
  function renderCoupleHeader() {
    if (coupleNamesElem) {
      coupleNamesElem.textContent = `${appData.partner1} & ${appData.partner2}`;
    }
  }

  function renderBottomTimeline() {
    if (!timelineNodesList) return;
    timelineNodesList.innerHTML = '';

    appData.milestones.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = `timeline-node-btn ${idx === currentMilestoneIndex ? 'active' : ''}`;
      const name = item.planetName || `Mốc ${idx + 1}`;
      btn.title = `${name} (${item.date})`;
      btn.innerHTML = `
        <span class="timeline-node-dot"></span>
        <span class="timeline-node-label">${idx + 1}. ${name.replace('Hành Tinh ', '')}</span>
      `;

      btn.addEventListener('click', () => {
        openPlanetDetail(idx);
      });

      timelineNodesList.appendChild(btn);
    });
  }

  function updateTimelineActiveState(activeIdx) {
    const nodes = timelineNodesList.querySelectorAll('.timeline-node-btn');
    nodes.forEach((n, i) => {
      if (i === activeIdx) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });
  }

  /* =========================================================================
     ATMOSPHERIC DIVE CONTROLLER (Hướng 2)
     ========================================================================= */
  class AtmosphereManager {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.currentType = null;
      this.particles = [];
      this.animationFrameId = null;
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      if (this.canvas) {
        window.addEventListener('resize', () => this.resize());
        this.resize();
      }
    }

    resize() {
      if (!this.canvas) return;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    start(type) {
      if (!this.canvas || !this.ctx) return;
      this.stop();
      this.currentType = type || 'book_pages';
      this.canvas.classList.add('active');
      this.initParticles(this.currentType);
      this.animate();
    }

    stop() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.canvas) {
        this.canvas.classList.remove('active');
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
      this.particles = [];
    }

    initParticles(type) {
      this.particles = [];
      const count = type === 'fireworks_midnight' ? 45 : 60;
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle(type, true));
      }
    }

    createParticle(type, randomY = false) {
      const y = randomY ? Math.random() * this.height : -30;
      const x = Math.random() * this.width;

      switch (type) {
        case 'book_pages':
          return {
            type,
            x,
            y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: 0.6 + Math.random() * 1.4,
            width: 14 + Math.random() * 18,
            height: 18 + Math.random() * 22,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.04,
            char: Math.random() < 0.35 ? ['📖', '📜', '✨', '🤍', '🔖'][Math.floor(Math.random() * 5)] : null,
            alpha: 0.4 + Math.random() * 0.5,
          };

        case 'gem_cafe':
          return {
            type,
            x,
            y: randomY ? y : this.height + 20,
            vx: (Math.random() - 0.5) * 1.0,
            vy: -(0.8 + Math.random() * 1.8),
            size: 6 + Math.random() * 16,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.05,
            isGem: Math.random() < 0.4,
            gemColor: ['#72efdd', '#48bfe3', '#ffffff', '#ffd166'][Math.floor(Math.random() * 4)],
            alpha: 0.3 + Math.random() * 0.6,
          };

        case 'fireworks_midnight':
          return {
            type,
            x: Math.random() * this.width,
            y: Math.random() * this.height * 0.7,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: 2 + Math.random() * 3.5,
            color: ['#ffaa00', '#ff3377', '#72efdd', '#ffffff', '#ffd166'][Math.floor(Math.random() * 5)],
            alpha: 0.8 + Math.random() * 0.2,
            decay: 0.012 + Math.random() * 0.015,
          };

        case 'hoan_kiem_autumn':
          return {
            type,
            x,
            y,
            vx: 0.8 + Math.random() * 1.5,
            vy: 0.7 + Math.random() * 1.3,
            size: 14 + Math.random() * 18,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.06,
            color: ['#ff8800', '#ffaa00', '#e63946', '#ffd166'][Math.floor(Math.random() * 4)],
            icon: Math.random() < 0.25 ? '🍂' : (Math.random() < 0.15 ? '🏮' : null),
            alpha: 0.5 + Math.random() * 0.4,
          };

        case 'cozy_kitchen':
          return {
            type,
            x,
            y: randomY ? y : this.height + 20,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(0.8 + Math.random() * 1.6),
            size: 8 + Math.random() * 18,
            isHeart: Math.random() < 0.35,
            color: ['#ffaa00', '#ff5500', '#ffd166', '#ff85a2'][Math.floor(Math.random() * 4)],
            alpha: 0.4 + Math.random() * 0.5,
          };

        case 'anniversary_roses':
        default:
          return {
            type: 'anniversary_roses',
            x,
            y,
            vx: (Math.random() - 0.5) * 1.6 + 0.3,
            vy: 1.0 + Math.random() * 1.8,
            size: 14 + Math.random() * 20,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.05,
            isBlueRose: Math.random() < 0.5,
            isGoldenStar: Math.random() < 0.2,
            alpha: 0.5 + Math.random() * 0.45,
          };
      }
    }

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Periodically trigger a mini firework burst for midnight milestone
      if (this.currentType === 'fireworks_midnight' && Math.random() < 0.06) {
        const cx = Math.random() * this.width;
        const cy = Math.random() * (this.height * 0.65);
        const color = ['#ffaa00', '#ff3377', '#72efdd', '#ffd166', '#ffffff'][Math.floor(Math.random() * 5)];
        for (let k = 0; k < 18; k++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 4;
          this.particles.push({
            type: 'fireworks_midnight',
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2.5 + Math.random() * 2.5,
            color,
            alpha: 1.0,
            decay: 0.018 + Math.random() * 0.02,
          });
        }
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.vRot) p.rot += p.vRot;

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.translate(p.x, p.y);
        if (p.rot) this.ctx.rotate(p.rot);

        if (p.type === 'book_pages') {
          if (p.char) {
            this.ctx.font = '18px serif';
            this.ctx.fillText(p.char, 0, 0);
          } else {
            this.ctx.fillStyle = '#fdfbf7';
            this.ctx.shadowColor = '#ffd166';
            this.ctx.shadowBlur = 8;
            this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            this.ctx.strokeStyle = '#d4af37';
            this.ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
          }
        } else if (p.type === 'gem_cafe') {
          if (p.isGem) {
            this.ctx.fillStyle = p.gemColor;
            this.ctx.shadowColor = p.gemColor;
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -p.size);
            this.ctx.lineTo(p.size * 0.7, 0);
            this.ctx.lineTo(0, p.size);
            this.ctx.lineTo(-p.size * 0.7, 0);
            this.ctx.closePath();
            this.ctx.fill();
          } else {
            this.ctx.fillStyle = 'rgba(255, 240, 200, 0.35)';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.ctx.fill();
          }
        } else if (p.type === 'fireworks_midnight') {
          p.alpha -= p.decay || 0.015;
          this.ctx.fillStyle = p.color;
          this.ctx.shadowColor = p.color;
          this.ctx.shadowBlur = 8;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (p.type === 'hoan_kiem_autumn') {
          if (p.icon) {
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText(p.icon, 0, 0);
          } else {
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, p.size, p.size * 0.45, Math.PI / 4, 0, Math.PI * 2);
            this.ctx.fill();
          }
        } else if (p.type === 'cozy_kitchen') {
          if (p.isHeart) {
            this.ctx.font = '18px sans-serif';
            this.ctx.fillText('🧡', 0, 0);
          } else {
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
          }
        } else {
          if (p.isGoldenStar) {
            this.ctx.font = '16px sans-serif';
            this.ctx.fillText('✨', 0, 0);
          } else {
            this.ctx.fillStyle = p.isBlueRose ? '#1e88e5' : '#e6004c';
            this.ctx.shadowColor = p.isBlueRose ? '#72efdd' : '#ff85a2';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -p.size * 0.5);
            this.ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.4, p.size * 0.6, p.size * 0.4, 0, p.size * 0.6);
            this.ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.4, -p.size * 0.6, -p.size * 0.4, 0, -p.size * 0.5);
            this.ctx.fill();
          }
        }

        this.ctx.restore();

        if (p.type === 'fireworks_midnight') {
          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
          }
        } else if (p.vy > 0 && p.y > this.height + 40) {
          this.particles[i] = this.createParticle(this.currentType, false);
        } else if (p.vy < 0 && p.y < -40) {
          this.particles[i] = this.createParticle(this.currentType, false);
        }
      }

      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }

  /* =========================================================================
     INTERACTIVE SECRET SCRATCH CARD CONTROLLER (Hướng 3)
     ========================================================================= */
  class ScratchCardManager {
    constructor() {
      this.canvas = document.getElementById('scratch-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.isDrawing = false;
      this.isRevealed = false;
      this.strokeCount = 0;
      this.onComplete = null;

      if (this.canvas) {
        this.bindEvents();
      }

      const btnReveal = document.getElementById('btn-reveal-scratch');
      if (btnReveal) {
        btnReveal.addEventListener('click', () => this.revealAll(true));
      }
    }

    init(secretText, onComplete) {
      if (!this.canvas || !this.ctx) return;
      this.isRevealed = false;
      this.strokeCount = 0;
      this.onComplete = onComplete;

      const container = this.canvas.parentElement;
      const rect = container.getBoundingClientRect();
      const w = Math.max(rect.width || 340, 320);
      const h = Math.max(rect.height || 75, 75);

      this.canvas.width = w;
      this.canvas.height = h;
      this.canvas.style.display = 'block';
      this.canvas.style.opacity = '1';

      const ctx = this.ctx;
      ctx.globalCompositeOperation = 'source-over';

      // Shimmering metallic gold/silver coating
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#d4af37');
      grad.addColorStop(0.3, '#f9e8a2');
      grad.addColorStop(0.6, '#b8860b');
      grad.addColorStop(1, '#e6ca65');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Gold shimmer sparkles pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 1 + Math.random() * 2.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Instruction watermark text
      ctx.fillStyle = '#4a3300';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ DI CHUỘT / CÀO TẠI ĐÂY ĐỂ ĐỌC LỜI NHẮN ✨', w / 2, h / 2);
    }

    bindEvents() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      };

      const scratch = (pos) => {
        if (!this.isDrawing || this.isRevealed) return;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
        this.ctx.fill();

        this.strokeCount++;
        if (this.strokeCount % 12 === 0) {
          this.checkScratchPercent();
        }
      };

      this.canvas.addEventListener('mousedown', (e) => {
        this.isDrawing = true;
        scratch(getPos(e));
      });

      this.canvas.addEventListener('mousemove', (e) => {
        if (this.isDrawing) scratch(getPos(e));
      });

      window.addEventListener('mouseup', () => {
        this.isDrawing = false;
      });

      // Touch support
      this.canvas.addEventListener('touchstart', (e) => {
        this.isDrawing = true;
        scratch(getPos(e));
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (this.isDrawing) scratch(getPos(e));
      }, { passive: true });

      this.canvas.addEventListener('touchend', () => {
        this.isDrawing = false;
      });
    }

    checkScratchPercent() {
      if (this.isRevealed || !this.ctx) return;
      try {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const imgData = this.ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        let cleared = 0;
        const total = data.length / 4;
        for (let i = 3; i < data.length; i += 16) {
          if (data[i] === 0) cleared++;
        }
        const pct = (cleared / (total / 4)) * 100;
        if (pct > 38) {
          this.revealAll(true);
        }
      } catch (e) {}
    }

    revealAll(celebrate = false) {
      if (this.isRevealed) return;
      this.isRevealed = true;
      if (this.canvas) {
        this.canvas.style.transition = 'opacity 0.4s ease';
        this.canvas.style.opacity = '0';
        setTimeout(() => {
          this.canvas.style.display = 'none';
        }, 400);
      }
      if (celebrate && typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#ffaa00', '#ffd166', '#ffffff', '#72efdd'],
        });
      }
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }
  }

  /* =========================================================================
     WAX SEAL ENVELOPE CONTROLLER (Hướng 3)
     ========================================================================= */
  class WaxSealEnvelopeManager {
    constructor(bgmInstance, scratchCardMgrInstance) {
      this.bgm = bgmInstance;
      this.scratchCardMgr = scratchCardMgrInstance;
      this.overlay = document.getElementById('wax-seal-overlay');
      this.btnWaxSeal = document.getElementById('btn-wax-seal');
      this.unsealedContent = document.getElementById('unsealed-content');
      this.btnReseal = document.getElementById('btn-reseal-envelope');
      this.envelopeTitle = document.getElementById('envelope-milestone-title');
      this.envelopeTag = document.getElementById('envelope-planet-tag');

      if (this.btnWaxSeal) {
        this.btnWaxSeal.addEventListener('click', () => this.unseal());
      }
      if (this.btnReseal) {
        this.btnReseal.addEventListener('click', () => this.reseal());
      }
    }

    show(milestone) {
      if (this.envelopeTitle) this.envelopeTitle.textContent = milestone.planetName || milestone.date || 'Bức Thư Thời Gian';
      if (this.envelopeTag) this.envelopeTag.textContent = `🪐 ${(milestone.planetName || milestone.date).toUpperCase()}`;

      // Reset to sealed envelope state
      if (this.overlay) this.overlay.classList.remove('unsealed');
      if (this.unsealedContent) this.unsealedContent.classList.remove('revealed');
    }

    unseal() {
      // Play celebratory harp sound
      this.bgm.initContext();
      if (this.bgm.ctx) {
        this.bgm.playTone(523.25, this.bgm.ctx.currentTime, 1.2, 0.1); // C5
        this.bgm.playTone(659.25, this.bgm.ctx.currentTime + 0.12, 1.2, 0.1); // E5
        this.bgm.playTone(783.99, this.bgm.ctx.currentTime + 0.24, 1.4, 0.12); // G5
        this.bgm.playTone(1046.50, this.bgm.ctx.currentTime + 0.36, 1.8, 0.15); // C6
      }

      // Crack wax seal with sparkles!
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ff4076', '#ffaa00', '#ffd166', '#ffffff', '#72efdd'],
        });
      }

      if (this.overlay) this.overlay.classList.add('unsealed');
      if (this.unsealedContent) this.unsealedContent.classList.add('revealed');

      // Initialize scratch card after slide out
      setTimeout(() => {
        const item = appData.milestones[currentMilestoneIndex];
        if (this.scratchCardMgr && item) {
          this.scratchCardMgr.init(item.secretMessage);
        }
      }, 350);
    }

    reseal() {
      if (this.overlay) this.overlay.classList.remove('unsealed');
      if (this.unsealedContent) this.unsealedContent.classList.remove('revealed');
    }
  }

  // Global Managers
  let atmosphereMgr = null;
  let scratchCardMgr = null;
  let envelopeMgr = null;

  /* =========================================================================
     MODAL CONTROLLERS (PLANET DETAIL)
     ========================================================================= */
  function openPlanetDetail(index) {
    if (index < 0 || index >= appData.milestones.length) return;
    currentMilestoneIndex = index;
    const item = appData.milestones[index];

    // Populate modal fields
    document.getElementById('modal-planet-badge').textContent = `🪐 ${item.planetName || 'Mốc ' + (index + 1)}`;
    const atmBadge = document.getElementById('modal-atmosphere-badge');
    if (atmBadge) atmBadge.textContent = item.atmosphereName || '✨ Bầu Khí Quyển Kỷ Niệm';

    const titleEl = document.getElementById('modal-milestone-title');
    if (titleEl) titleEl.textContent = item.planetName || item.date || 'Kỷ Niệm Yêu Thương';
    document.getElementById('modal-milestone-date').textContent = `📅 ${item.date}`;
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-caption').textContent = item.caption || item.date;
    document.getElementById('modal-story-text').textContent = item.story;
    document.getElementById('modal-quote-text').textContent = item.quote;

    const secretTextEl = document.getElementById('scratch-secret-text');
    if (secretTextEl) {
      secretTextEl.textContent = item.secretMessage || 'Anh yêu em nhiều lắm! ❤️';
    }

    // Update nav button states
    btnPrevMilestone.disabled = index === 0;
    btnPrevMilestone.style.opacity = index === 0 ? '0.4' : '1';
    btnNextMilestone.disabled = index === appData.milestones.length - 1;
    btnNextMilestone.style.opacity = index === appData.milestones.length - 1 ? '0.4' : '1';

    // Focus 3D camera to planet
    if (window.LoveScene) {
      window.LoveScene.focusPlanet(index);
    }

    updateTimelineActiveState(index);

    // 1. Trigger Atmospheric Dive Effect (Hướng 2)
    if (atmosphereMgr) {
      atmosphereMgr.start(item.atmosphereType);
    }

    // 2. Setup Wax-Sealed Envelope (Hướng 3)
    if (envelopeMgr) {
      envelopeMgr.show(item);
    }

    // Show modal
    planetModal.classList.add('open');

    // Sweet micro confetti when viewing 365 days milestone
    if (index === appData.milestones.length - 1 && typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#ff3377', '#ffd1dc', '#ffffff'],
      });
    }
  }

  function closePlanetDetail() {
    planetModal.classList.remove('open');
    if (atmosphereMgr) {
      atmosphereMgr.stop();
    }
    if (window.LoveScene) {
      window.LoveScene.resetToGalaxy();
    }
  }

  /* =========================================================================
     CUSTOMIZER MODAL
     ========================================================================= */
  const ATMOSPHERE_OPTIONS = [
    { id: 'book_pages', name: '📚 Trang Sách & Ánh Sao' },
    { id: 'gem_cafe', name: '☕ Cà Phê & Lắc Pha Lê' },
    { id: 'fireworks_midnight', name: '🎆 Pháo Hoa Giao Thừa' },
    { id: 'hoan_kiem_autumn', name: '🍂 Lá Vàng & Hồ Gươm' },
    { id: 'cozy_kitchen', name: '🍳 Bếp Lửa Cơm Nhà' },
    { id: 'anniversary_roses', name: '🌹 Mưa Cánh Hoa Hồng & Vô Cực' },
  ];

  const ATMOSPHERE_NAMES = {
    book_pages: '📚 Trang Sách & Ánh Sao',
    gem_cafe: '☕ Cà Phê & Lắc Pha Lê',
    fireworks_midnight: '🎆 Pháo Hoa Giao Thừa',
    hoan_kiem_autumn: '🍂 Lá Vàng & Hồ Gươm',
    cozy_kitchen: '🍳 Bếp Lửa Cơm Nhà',
    anniversary_roses: '🌹 Mưa Cánh Hoa Hồng & Vô Cực',
  };

  let editingMilestones = [];

  function syncEditingMilestonesFromDOM() {
    if (!editModal) return;
    const items = editModal.querySelectorAll('.milestone-edit-item');
    items.forEach((itemEl, idx) => {
      if (!editingMilestones[idx]) return;
      const planetNameInput = itemEl.querySelector('.edit-planet-name');
      const dateInput = itemEl.querySelector('.edit-date');
      const atmosphereSelect = itemEl.querySelector('.edit-atmosphere');
      const storyTextarea = itemEl.querySelector('.edit-story');
      const quoteInput = itemEl.querySelector('.edit-quote');
      const secretInput = itemEl.querySelector('.edit-secret');

      if (planetNameInput) editingMilestones[idx].planetName = planetNameInput.value.trim();
      if (dateInput) editingMilestones[idx].date = dateInput.value.trim();
      if (atmosphereSelect) {
        editingMilestones[idx].atmosphereType = atmosphereSelect.value;
        editingMilestones[idx].atmosphereName = ATMOSPHERE_NAMES[atmosphereSelect.value] || '✨ Kỷ Niệm';
      }
      if (storyTextarea) editingMilestones[idx].story = storyTextarea.value.trim();
      if (quoteInput) editingMilestones[idx].quote = quoteInput.value.trim();
      if (secretInput) editingMilestones[idx].secretMessage = secretInput.value.trim();
    });
  }

  function renderCustomizerMilestonesList() {
    const listContainer = document.getElementById('milestones-edit-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    editingMilestones.forEach((m, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'milestone-edit-item';
      itemEl.innerHTML = `
        <div class="milestone-item-header">
          <span>🪐 Mốc ${idx + 1}: ${m.planetName || 'Hành Tinh ' + (idx + 1)}</span>
          <div class="item-actions">
            <label class="btn-change-photo" style="cursor: pointer;">
              📷 Thay ảnh
              <input type="file" class="edit-photo-input" data-index="${idx}" accept="image/*" style="display: none;">
            </label>
            <button type="button" class="btn-delete-milestone" data-index="${idx}" title="Xóa mốc kỷ niệm này">🗑️ Xóa</button>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tên mốc / Hành tinh:</label>
            <input type="text" class="edit-planet-name" data-index="${idx}" value="${m.planetName || ''}">
          </div>
          <div class="form-group">
            <label>Thời gian / Ngày kỷ niệm:</label>
            <input type="text" class="edit-date" data-index="${idx}" value="${m.date || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group full-width">
            <label>Bầu không khí tiểu cảnh (Hiệu ứng hạt rơi):</label>
            <select class="edit-atmosphere" data-index="${idx}">
              ${ATMOSPHERE_OPTIONS.map(opt => `<option value="${opt.id}" ${m.atmosphereType === opt.id ? 'selected' : ''}>${opt.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Nội dung bức thư kỷ niệm:</label>
          <textarea class="edit-story" data-index="${idx}" rows="3">${m.story || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Lời nhắn / Câu nói ngọt ngào (Quote):</label>
          <input type="text" class="edit-quote" data-index="${idx}" value="${m.quote || ''}">
        </div>
        <div class="form-group">
          <label>🔒 Lời nhắn bí mật (Để người yêu cào xem):</label>
          <input type="text" class="edit-secret" data-index="${idx}" value="${m.secretMessage || ''}">
        </div>
      `;

      // Photo upload change listener
      const photoInput = itemEl.querySelector('.edit-photo-input');
      photoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            showSyncToast(`⏳ Đang nén và chuẩn bị ảnh cho mốc ${idx + 1}...`);
            const compressed = await compressImage(file);
            m.image = compressed;
            showSyncToast(`✅ Đã chọn ảnh mới cho mốc ${idx + 1}! Bấm "Lưu Thay Đổi" để hoàn tất.`);
          } catch (err) {
            console.error('Photo upload error:', err);
          }
        }
      });

      // Delete milestone listener
      const btnDelete = itemEl.querySelector('.btn-delete-milestone');
      btnDelete.addEventListener('click', () => {
        if (editingMilestones.length <= 1) {
          alert('Cần giữ lại ít nhất 1 mốc kỷ niệm trong vũ trụ của hai bạn nhé!');
          return;
        }
        if (confirm(`Bạn có chắc muốn xóa mốc "${m.planetName || 'Mốc ' + (idx + 1)}"?`)) {
          syncEditingMilestonesFromDOM();
          editingMilestones.splice(idx, 1);
          renderCustomizerMilestonesList();
        }
      });

      listContainer.appendChild(itemEl);
    });
  }

  function openCustomizerModal() {
    document.getElementById('edit-partner1').value = appData.partner1;
    document.getElementById('edit-partner2').value = appData.partner2;
    document.getElementById('edit-start-date').value = appData.startDate;

    const capsule = appData.timeCapsule || DEFAULT_CONFIG.timeCapsule;
    const capTitleInput = document.getElementById('edit-capsule-title');
    const capDateInput = document.getElementById('edit-capsule-date');
    const capMsgInput = document.getElementById('edit-capsule-message');
    if (capTitleInput) capTitleInput.value = capsule.title || '';
    if (capDateInput) capDateInput.value = capsule.unlockDate || '2026-12-31T23:59';
    if (capMsgInput) capMsgInput.value = capsule.message || '';

    editingMilestones = JSON.parse(JSON.stringify(appData.milestones));
    renderCustomizerMilestonesList();

    // Attach Add Milestone button handler
    const btnAddMilestone = document.getElementById('btn-add-milestone');
    if (btnAddMilestone) {
      btnAddMilestone.onclick = () => {
        syncEditingMilestonesFromDOM();
        const newIdx = editingMilestones.length + 1;
        const defaultAtmospheres = ['book_pages', 'gem_cafe', 'fireworks_midnight', 'hoan_kiem_autumn', 'cozy_kitchen', 'anniversary_roses'];
        const chosenAtm = defaultAtmospheres[(newIdx - 1) % defaultAtmospheres.length];

        editingMilestones.push({
          id: Date.now(),
          planetName: `Hành Tinh Số ${newIdx}`,
          date: 'Ngày Kỷ Niệm',
          image: `assets/milestone_${((newIdx - 1) % 6) + 1}.jpg`,
          caption: 'Khoảnh khắc đáng nhớ của chúng mình...',
          atmosphereType: chosenAtm,
          atmosphereName: ATMOSPHERE_NAMES[chosenAtm] || '✨ Kỷ Niệm',
          story: 'Viết nên câu chuyện kỷ niệm ngọt ngào tại đây...',
          quote: 'Yêu em hơn mỗi ngày!',
          secretMessage: 'Anh luôn yêu và trân trọng em mỗi ngày! ❤️'
        });
        renderCustomizerMilestonesList();
        const listContainer = document.getElementById('milestones-edit-list');
        if (listContainer) listContainer.scrollTop = listContainer.scrollHeight;
      };
    }

    editModal.classList.add('open');
  }

  function saveCustomizerData() {
    syncEditingMilestonesFromDOM();

    appData.partner1 = document.getElementById('edit-partner1').value.trim() || 'Anh';
    appData.partner2 = document.getElementById('edit-partner2').value.trim() || 'Em';
    appData.startDate = document.getElementById('edit-start-date').value || '2025-10-21';
    appData.milestones = editingMilestones;

    const capTitle = document.getElementById('edit-capsule-title');
    const capDate = document.getElementById('edit-capsule-date');
    const capMsg = document.getElementById('edit-capsule-message');
    if (capTitle && capDate && capMsg) {
      appData.timeCapsule = {
        title: capTitle.value.trim() || 'Bức Thư Gửi Tương Lai',
        unlockDate: capDate.value || '2026-12-31T23:59',
        message: capMsg.value.trim() || 'Yêu em vô cùng! ❤️',
        author: appData.partner1 || 'Anh'
      };
    }

    appData.lastUpdated = Date.now();
    persistData();
    renderCoupleHeader();
    renderBottomTimeline();
    updateAnniversaryCounter();

    // Rebuild 3D Universe and Planets dynamically
    if (window.LoveScene && typeof window.LoveScene.rebuildPlanets === 'function') {
      window.LoveScene.rebuildPlanets(appData.milestones);
    }

    editModal.classList.remove('open');

    // Sync with Neon Cloud Database
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    }).then(() => {
      showSyncToast('💾 Đã lưu và đồng bộ toàn bộ mốc kỷ niệm sang mọi thiết bị 24/7!');
    }).catch(() => {
      showSyncToast('💾 Đã lưu thay đổi vào trình duyệt!');
    });

    // Visual notification
    if (typeof confetti === 'function') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    }
  }

  function resetToDefault() {
    if (confirm('Bạn có chắc chắn muốn khôi phục về nội dung mẫu ban đầu không?')) {
      appData = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      persistData();
      openCustomizerModal();
      renderCoupleHeader();
      renderBottomTimeline();
      updateAnniversaryCounter();
    }
  }

  /* =========================================================================
     SPARKLE CURSOR TRAIL EFFECT
     ========================================================================= */
  let lastSparkleTime = 0;
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastSparkleTime > 45) {
      lastSparkleTime = now;
      const dot = document.createElement('div');
      dot.className = 'sparkle-dot';
      const size = 6 + Math.random() * 8;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 750);
    }
  });

  /* =========================================================================
     4 NEW ROMANTIC FEATURES MANAGERS
     ========================================================================= */

  // --- Feature 1: Time Capsule (Hộp Thư Thời Gian Hẹn Giờ) ---
  let capsuleTimerInterval = null;

  function openTimeCapsuleModal() {
    const capsule = appData.timeCapsule || DEFAULT_CONFIG.timeCapsule;
    const lockedView = document.getElementById('capsule-locked-view');
    const unlockedView = document.getElementById('capsule-unlocked-view');
    const lockedTitle = document.getElementById('capsule-locked-title');
    const targetDateEl = document.getElementById('capsule-unlock-date-display');

    if (lockedTitle) lockedTitle.textContent = capsule.title || 'Bức Thư Gửi Tương Lai';

    const targetTime = new Date(capsule.unlockDate).getTime();
    try {
      const formattedDate = new Date(capsule.unlockDate).toLocaleString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      });
      if (targetDateEl) targetDateEl.textContent = formattedDate;
    } catch (e) {
      if (targetDateEl) targetDateEl.textContent = capsule.unlockDate;
    }

    function updateCapsuleTimer() {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        // UNLOCKED
        if (lockedView) lockedView.classList.add('hidden');
        if (unlockedView) {
          unlockedView.classList.remove('hidden');
          document.getElementById('capsule-unlocked-title').textContent = capsule.title || 'Bức Thư Thời Gian Đã Mở Khóa';
          document.getElementById('capsule-unlocked-content').textContent = capsule.message;
          document.getElementById('capsule-unlocked-sign').textContent = `Mãi yêu ${appData.partner2}, ${capsule.author || appData.partner1} ❤️`;
        }
        if (capsuleTimerInterval) {
          clearInterval(capsuleTimerInterval);
          capsuleTimerInterval = null;
        }
      } else {
        // STILL LOCKED
        if (lockedView) lockedView.classList.remove('hidden');
        if (unlockedView) unlockedView.classList.add('hidden');

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('capsule-days');
        const hEl = document.getElementById('capsule-hours');
        const mEl = document.getElementById('capsule-mins');
        const sEl = document.getElementById('capsule-secs');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(mins).padStart(2, '0');
        if (sEl) sEl.textContent = String(secs).padStart(2, '0');
      }
    }

    updateCapsuleTimer();
    if (capsuleTimerInterval) clearInterval(capsuleTimerInterval);
    capsuleTimerInterval = setInterval(updateCapsuleTimer, 1000);

    const modal = document.getElementById('timecapsule-modal');
    if (modal) modal.classList.add('open');
  }

  function closeTimeCapsuleModal() {
    const modal = document.getElementById('timecapsule-modal');
    if (modal) modal.classList.remove('open');
    if (capsuleTimerInterval) {
      clearInterval(capsuleTimerInterval);
      capsuleTimerInterval = null;
    }
  }

  // --- Feature 2: Couple Bucket List (Danh Sách Ước Nguyện Đôi Mình) ---
  function openBucketListModal() {
    renderBucketList();
    const modal = document.getElementById('bucketlist-modal');
    if (modal) modal.classList.add('open');
  }

  function closeBucketListModal() {
    const modal = document.getElementById('bucketlist-modal');
    if (modal) modal.classList.remove('open');
  }

  function renderBucketList() {
    const list = appData.bucketList || [];
    const container = document.getElementById('bucketlist-items-container');
    const progressText = document.getElementById('bucketlist-progress-text');
    const progressFill = document.getElementById('bucketlist-progress-fill');

    if (!container) return;
    container.innerHTML = '';

    const total = list.length;
    const completed = list.filter(w => w.done).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (progressText) progressText.textContent = `Đã hoàn thành: ${completed} / ${total} điều ước (${percent}%)`;
    if (progressFill) progressFill.style.width = `${percent}%`;

    list.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = `bucket-item ${item.done ? 'done' : ''}`;
      itemEl.innerHTML = `
        <div class="bucket-item-left">
          <div class="bucket-checkbox">${item.done ? '✓' : ''}</div>
          <span class="bucket-text">${item.text}</span>
        </div>
        <button type="button" class="btn-del-wish" title="Xóa điều ước này">✕</button>
      `;

      // Toggle check
      const leftPart = itemEl.querySelector('.bucket-item-left');
      leftPart.addEventListener('click', () => {
        item.done = !item.done;
        if (item.done && typeof confetti === 'function') {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        }
        appData.lastUpdated = Date.now();
        persistData();
        renderBucketList();

        fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appData)
        }).catch(() => {});
      });

      // Delete wish
      const btnDel = itemEl.querySelector('.btn-del-wish');
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        appData.bucketList.splice(index, 1);
        appData.lastUpdated = Date.now();
        persistData();
        renderBucketList();

        fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appData)
        }).catch(() => {});
      });

      container.appendChild(itemEl);
    });
  }

  function addNewWish() {
    const input = document.getElementById('new-wish-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    if (!appData.bucketList) appData.bucketList = [];
    appData.bucketList.push({
      id: Date.now(),
      text: text,
      done: false
    });

    input.value = '';
    appData.lastUpdated = Date.now();
    persistData();
    renderBucketList();

    if (typeof confetti === 'function') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }

    const container = document.getElementById('bucketlist-items-container');
    if (container) container.scrollTop = container.scrollHeight;

    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    }).then(() => {
      showSyncToast('✨ Đã thêm điều ước mới và đồng bộ sang mọi thiết bị!');
    }).catch(() => {});
  }

  // --- Feature 3: Anniversary Card Generator (Xuất Thiệp Ảnh Kỷ Niệm) ---
  let generatedCardDataUrl = null;

  async function generateAnniversaryCard() {
    const modal = document.getElementById('card-preview-modal');
    const spinner = document.getElementById('card-loading-spinner');
    const previewImg = document.getElementById('card-preview-img');

    if (modal) modal.classList.add('open');
    if (spinner) spinner.classList.remove('hidden');
    if (previewImg) previewImg.classList.add('hidden');

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    // 1. Nebula background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1440);
    bgGrad.addColorStop(0, '#0a0314');
    bgGrad.addColorStop(0.3, '#1c0734');
    bgGrad.addColorStop(0.7, '#2a0845');
    bgGrad.addColorStop(1, '#0b001a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1440);

    // 2. Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 220; i++) {
      const sx = Math.random() * 1080;
      const sy = Math.random() * 1440;
      const sr = Math.random() * 2.2 + 0.5;
      const alpha = Math.random() * 0.85 + 0.15;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 3. Gold Foil Double Border
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1000, 1360);

    ctx.strokeStyle = 'rgba(255, 117, 143, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, 976, 1336);

    // Corner Ornaments
    const corners = [
      [40, 40], [1040, 40], [40, 1400], [1040, 1400]
    ];
    ctx.fillStyle = '#ffd166';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Header Badge
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff9cb7';
    ctx.font = '600 24px Inter, sans-serif';
    ctx.fillText('✨ OUR LOVE STORY ✨', 540, 120);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Playfair Display", serif';
    ctx.fillText('Kỷ Niệm Tình Yêu', 540, 190);

    // Couple Names
    ctx.fillStyle = '#ff758f';
    ctx.font = 'bold 44px "Dancing Script", cursive, sans-serif';
    ctx.fillText(`${appData.partner1}  💖  ${appData.partner2}`, 540, 255);

    // Calculate days together
    const start = new Date(appData.startDate).getTime();
    const now = Date.now();
    const days = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));

    // Days Badge
    ctx.fillStyle = 'rgba(255, 209, 102, 0.15)';
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(340, 290, 400, 56, [28]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = '600 26px Inter, sans-serif';
    ctx.fillText(`🗓️ ${days} Ngày Yêu Thương`, 540, 328);

    // 5. Draw Featured Polaroid Photo
    const featuredPhotoSrc = (appData.milestones && appData.milestones[appData.milestones.length - 1] && appData.milestones[appData.milestones.length - 1].image) || 'assets/milestone_6.jpg';

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = featuredPhotoSrc;
      });

      // Polaroid Card Frame
      const pX = 190, pY = 385, pW = 700, pH = 730;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 15;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(pX, pY, pW, pH, [16]);
      ctx.fill();
      ctx.restore();

      // Draw photo inside Polaroid
      const imgX = pX + 25, imgY = pY + 25, imgW = pW - 50, imgH = 550;
      if (img.width) {
        const imgRatio = img.width / img.height;
        const boxRatio = imgW / imgH;
        let sWidth = img.width, sHeight = img.height, sx = 0, sy = 0;
        if (imgRatio > boxRatio) {
          sWidth = img.height * boxRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / boxRatio;
          sy = (img.height - sHeight) / 2;
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, imgX, imgY, imgW, imgH);
      } else {
        ctx.fillStyle = '#fce4ec';
        ctx.fillRect(imgX, imgY, imgW, imgH);
      }

      // Polaroid caption inside card
      ctx.fillStyle = '#222222';
      ctx.font = '600 28px "Dancing Script", cursive, sans-serif';
      const lastMs = appData.milestones[appData.milestones.length - 1];
      const capText = lastMs && lastMs.caption ? lastMs.caption : 'Vạn dặm tương lai cùng em... 💕';
      ctx.fillText(capText, 540, pY + imgH + 75);

    } catch (err) {
      console.warn('Card image error:', err);
    }

    // 6. Bottom Sweet Quote
    const quote = (appData.milestones && appData.milestones[appData.milestones.length - 1] && appData.milestones[appData.milestones.length - 1].quote) ||
      '“365 ngày vừa qua chỉ là chương mở đầu cho câu chuyện tình yêu trăm năm của hai chúng ta.”';

    ctx.fillStyle = '#ffccd9';
    ctx.font = 'italic 25px "Merriweather", serif';
    ctx.fillText(`“${quote.replace(/[“”]/g, '')}”`, 540, 1200);

    // 7. Footer Stamp Date
    const todayStr = new Date().toLocaleDateString('vi-VN');
    ctx.fillStyle = '#ffd166';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(`✨ ${todayStr} • Mãi Mãi Một Tình Yêu ✨`, 540, 1280);

    generatedCardDataUrl = canvas.toDataURL('image/png');
    if (previewImg) {
      previewImg.src = generatedCardDataUrl;
      previewImg.classList.remove('hidden');
    }
    if (spinner) spinner.classList.add('hidden');
  }

  function downloadAnniversaryCard() {
    if (!generatedCardDataUrl) return;
    const a = document.createElement('a');
    a.href = generatedCardDataUrl;
    a.download = `Thiep_Ky_Niem_${appData.partner1}_${appData.partner2}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (typeof confetti === 'function') {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
    showSyncToast('📸 Đã tải thiệp kỷ niệm về máy của bạn!');
  }

  // --- Feature 4: Touch Heart Particle & Harmonic Chime ---
  const CHIME_FREQS = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  let chimeIndex = 0;
  let tapAudioCtx = null;

  function playTouchChime() {
    try {
      if (!tapAudioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        tapAudioCtx = new AudioContext();
      }
      if (tapAudioCtx.state === 'suspended') {
        tapAudioCtx.resume();
      }
      const freq = CHIME_FREQS[chimeIndex % CHIME_FREQS.length];
      chimeIndex++;

      const osc = tapAudioCtx.createOscillator();
      const gain = tapAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, tapAudioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, tapAudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, tapAudioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, tapAudioCtx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(tapAudioCtx.destination);

      osc.start(tapAudioCtx.currentTime);
      osc.stop(tapAudioCtx.currentTime + 0.65);
    } catch (e) {}
  }

  function spawnTouchHearts(x, y) {
    const container = document.getElementById('touch-effects-container');
    if (!container) return;

    const emojis = ['💖', '💕', '💗', '✨', '🌸', '🌹'];
    const count = 4;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'touch-heart-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 40;
      const rot = (Math.random() - 0.5) * 50;

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.setProperty('--rot', `${rot}deg`);

      container.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }

    playTouchChime();
  }

  /* =========================================================================
     APP INITIALIZATION & EVENT BINDINGS
     ========================================================================= */
  function initApp() {
    // 0. Instantiate Managers for Hướng 2 & Hướng 3
    atmosphereMgr = new AtmosphereManager('planet-atmosphere-canvas');
    scratchCardMgr = new ScratchCardManager();
    envelopeMgr = new WaxSealEnvelopeManager(bgm, scratchCardMgr);

    // 1. Initialize 3D Scene
    if (window.LoveScene) {
      window.LoveScene.init();
      if (typeof window.LoveScene.rebuildPlanets === 'function' && appData.milestones) {
        window.LoveScene.rebuildPlanets(appData.milestones);
      }

      // Hook 3D events
      window.LoveScene.onBoxClick = () => {
        triggerGiftOpen();
      };

      window.LoveScene.onPlanetHover = (idx, cfg, x, y) => {
        if (planetTooltip && appData.milestones[idx]) {
          const item = appData.milestones[idx];
          tooltipTitle.textContent = item.planetName || item.date || 'Kỷ Niệm';
          tooltipDate.textContent = item.date;
          planetTooltip.style.left = `${x}px`;
          planetTooltip.style.top = `${y}px`;
          planetTooltip.style.display = 'flex';
        }
      };

      window.LoveScene.onPlanetLeave = () => {
        if (planetTooltip) {
          planetTooltip.style.display = 'none';
        }
      };

      window.LoveScene.onPlanetClick = (idx) => {
        openPlanetDetail(idx);
      };
    }

    // 2. Render initial UI
    renderCoupleHeader();
    renderBottomTimeline();
    updateAnniversaryCounter();

    // 3. Gift Opening Action
    function triggerGiftOpen() {
      // Start background romantic music (tlinh - tình yêu có nghĩa là gì?) on first interaction
      playBGM();

      introOverlay.classList.add('hidden');

      if (window.LoveScene) {
        window.LoveScene.openGiftBox(() => {
          // Transition complete: Reveal universe HUD
          headerElem.classList.remove('hidden-initially');
          bottomTimeline.classList.remove('hidden-initially');
        });
      }
    }

    btnOpenGift.addEventListener('click', triggerGiftOpen);

    // 4. Modal Navigation Buttons
    btnCloseModal.addEventListener('click', closePlanetDetail);
    modalBackdrop.addEventListener('click', closePlanetDetail);
    btnBackGalaxy.addEventListener('click', closePlanetDetail);

    btnPrevMilestone.addEventListener('click', () => {
      if (currentMilestoneIndex > 0) {
        openPlanetDetail(currentMilestoneIndex - 1);
      }
    });

    btnNextMilestone.addEventListener('click', () => {
      if (currentMilestoneIndex < appData.milestones.length - 1) {
        openPlanetDetail(currentMilestoneIndex + 1);
      }
    });

    // 5. Replace current milestone photo directly in modal with auto-compression & cloud sync
    modalPhotoUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          showSyncToast('⏳ Đang xử lý và đồng bộ ảnh...');
          const compressed = await compressImage(file);
          document.getElementById('modal-image').src = compressed;
          const currentMs = appData.milestones[currentMilestoneIndex];
          await uploadMilestonePhoto(currentMs.id, compressed);
          renderBottomTimeline();
          if (typeof confetti === 'function') {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
          }
        } catch (err) {
          console.error('Photo upload error:', err);
        }
      }
    });

    // 6. Customizer Modal events
    btnEditMemories.addEventListener('click', openCustomizerModal);
    btnCloseEditModal.addEventListener('click', () => editModal.classList.remove('open'));
    editModalBackdrop.addEventListener('click', () => editModal.classList.remove('open'));
    btnSaveCustomizer.addEventListener('click', saveCustomizerData);
    btnResetDefault.addEventListener('click', resetToDefault);

    // 7. Reset to Gift Box
    btnResetBox.addEventListener('click', () => {
      closePlanetDetail();
      headerElem.classList.add('hidden-initially');
      bottomTimeline.classList.add('hidden-initially');
      introOverlay.classList.remove('hidden');
      if (window.LoveScene) {
        window.LoveScene.resetToGiftBox();
      }
    });

    // 7.1 METEOR SHOWER WITH ROMANTIC WISHES & CUTE ICONS
    const METEOR_WISHES = [
      { text: 'Mãi Yêu Em Nhất Trên Đời 💕', icon: '💖' },
      { text: 'Happy 1st Anniversary! 🌸', icon: '🌸' },
      { text: '365 Ngày Ngọt Ngào Bên Nhau ✨', icon: '✨' },
      { text: 'Cảm ơn vì đã đến bên anh 💌', icon: '💌' },
      { text: 'Nụ cười của em là cả vũ trụ 💫', icon: '💫' },
      { text: 'Em là món quà quý giá nhất 🧸', icon: '🧸' },
      { text: 'Yêu em hôm nay và mãi mãi 🎀', icon: '🎀' },
      { text: 'Cùng nhau đi hết cuộc đời nhé 💍', icon: '💍' },
      { text: 'Ngôi sao rực rỡ nhất trần đời 🌟', icon: '🌟' },
      { text: 'Mỗi ngày bên em đều là ngày ngọt ngào 🍓', icon: '🍓' },
      { text: 'Yêu công chúa nhỏ của anh 🥰', icon: '🥰' },
      { text: 'Hạnh phúc vì luôn có em 💕', icon: '💕' },
    ];

    const meteorLayer = document.getElementById('meteor-shower-layer');
    const btnMeteorShower = document.getElementById('btn-meteor-shower');

    function spawnMeteor(wishObj = null) {
      if (!meteorLayer) return;
      const item = wishObj || METEOR_WISHES[Math.floor(Math.random() * METEOR_WISHES.length)];

      const meteorEl = document.createElement('div');
      meteorEl.className = 'meteor-item';
      
      // Random starting top position from 5% to 55%
      const topOffset = 5 + Math.random() * 50;
      meteorEl.style.top = `${topOffset}vh`;

      // Gentle romantic speed between 15s and 20s (plenty of time to read & click)
      const duration = 15 + Math.random() * 5;
      meteorEl.style.animationDuration = `${duration}s`;

      meteorEl.innerHTML = `
        <div class="meteor-tail"></div>
        <div class="meteor-head">${item.icon}</div>
        <div class="meteor-text-bubble">
          <span>${item.text}</span>
        </div>
      `;

      // Click to pop meteor with sweet hearts!
      meteorEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            colors: ['#ff3377', '#ff85a2', '#ffffff', '#ffd1dc'],
          });
        }
        bgm.initContext();
        bgm.playTone(880, bgm.ctx.currentTime, 1.2, 0.12);
        meteorEl.style.transition = 'all 0.3s ease';
        meteorEl.style.transform = 'scale(1.4)';
        meteorEl.style.opacity = '0';
        setTimeout(() => meteorEl.remove(), 300);
      });

      meteorLayer.appendChild(meteorEl);

      // Clean up after animation finishes
      setTimeout(() => {
        if (meteorEl.parentNode) meteorEl.remove();
      }, duration * 1000 + 500);
    }

    function triggerMeteorShower(count = 7) {
      // Play high chime sound
      bgm.initContext();
      if (bgm.ctx) {
        bgm.playTone(659.25, bgm.ctx.currentTime, 1.5, 0.08); // E5
        bgm.playTone(880.00, bgm.ctx.currentTime + 0.15, 1.5, 0.08); // A5
        bgm.playTone(1046.50, bgm.ctx.currentTime + 0.3, 1.8, 0.1); // C6
      }

      // Stagger spawn meteors
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          spawnMeteor();
          if (window.LoveScene && typeof window.LoveScene.trigger3DMeteor === 'function') {
            window.LoveScene.trigger3DMeteor();
          }
        }, i * 350);
      }
    }

    if (btnMeteorShower) {
      btnMeteorShower.addEventListener('click', () => {
        triggerMeteorShower(8);
      });
    }

    // Theme Toggle (Blue Rose of Fire & Ice vs Pastel Pink)
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    if (btnToggleTheme) {
      btnToggleTheme.addEventListener('click', () => {
        const isPastel = document.body.classList.toggle('theme-pastel-pink');
        const newTheme = isPastel ? 'PASTEL_PINK' : 'BLUE_ROSE';
        if (window.LoveScene && typeof window.LoveScene.switchTheme === 'function') {
          window.LoveScene.switchTheme(newTheme);
        }
        btnToggleTheme.innerHTML = isPastel ? '🌸 Hồng Pastel' : '🌹 Hoa Hồng Xanh';
      });
    }

    // Ambient Meteor Timer in Universe mode
    setInterval(() => {
      if (window.LoveScene && window.LoveScene.state === 'UNIVERSE' && !planetModal.classList.contains('open')) {
        if (Math.random() < 0.65) {
          spawnMeteor();
        }
      }
    }, 4500);

    // 8. Sound Toggle (tlinh - tình yêu có nghĩa là gì?)
    btnToggleSound.addEventListener('click', toggleBGM);

    // 9. Custom MP3 / Music Upload
    customMusicInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        pauseBGM();
        const url = URL.createObjectURL(file);
        customAudioElement = new Audio(url);
        customAudioElement.loop = true;
        customAudioElement.play().then(() => {
          isCustomAudioPlaying = true;
          updateAudioButtonUI(true, 'Nhạc Của Bạn');
        }).catch(err => console.warn('Audio play error:', err));
      }
    });

    // 10. Multi-Device Realtime Sync listeners & Polling
    const btnForceSync = document.getElementById('btn-force-sync');
    if (btnForceSync) {
      btnForceSync.addEventListener('click', () => checkAndSyncServerData(true));
    }

    // --- 11. Couple Bucket List Event Listeners ---
    const btnBucketList = document.getElementById('btn-bucket-list');
    const btnCloseBucketlist = document.getElementById('btn-close-bucketlist');
    const btnCloseBucketlistBottom = document.getElementById('btn-close-bucketlist-bottom');
    const bucketlistBackdrop = document.getElementById('bucketlist-modal-backdrop');
    const btnAddWish = document.getElementById('btn-add-wish');
    const newWishInput = document.getElementById('new-wish-input');

    if (btnBucketList) btnBucketList.addEventListener('click', openBucketListModal);
    if (btnCloseBucketlist) btnCloseBucketlist.addEventListener('click', closeBucketListModal);
    if (btnCloseBucketlistBottom) btnCloseBucketlistBottom.addEventListener('click', closeBucketListModal);
    if (bucketlistBackdrop) bucketlistBackdrop.addEventListener('click', closeBucketListModal);
    if (btnAddWish) btnAddWish.addEventListener('click', addNewWish);
    if (newWishInput) {
      newWishInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addNewWish();
      });
    }

    // --- 12. Time Capsule Event Listeners ---
    const btnTimeCapsule = document.getElementById('btn-time-capsule');
    const btnCloseTimecapsule = document.getElementById('btn-close-timecapsule');
    const btnCloseTimecapsuleBottom = document.getElementById('btn-close-timecapsule-bottom');
    const timecapsuleBackdrop = document.getElementById('timecapsule-modal-backdrop');

    if (btnTimeCapsule) btnTimeCapsule.addEventListener('click', openTimeCapsuleModal);
    if (btnCloseTimecapsule) btnCloseTimecapsule.addEventListener('click', closeTimeCapsuleModal);
    if (btnCloseTimecapsuleBottom) btnCloseTimecapsuleBottom.addEventListener('click', closeTimeCapsuleModal);
    if (timecapsuleBackdrop) timecapsuleBackdrop.addEventListener('click', closeTimeCapsuleModal);

    // --- 13. Anniversary Card Generator Event Listeners ---
    const btnExportCard = document.getElementById('btn-export-card');
    const btnCloseCardModal = document.getElementById('btn-close-card-modal');
    const btnCloseCardBottom = document.getElementById('btn-close-card-bottom');
    const cardModalBackdrop = document.getElementById('card-preview-modal-backdrop');
    const btnDownloadCard = document.getElementById('btn-download-card');

    if (btnExportCard) btnExportCard.addEventListener('click', generateAnniversaryCard);
    if (btnCloseCardModal) btnCloseCardModal.addEventListener('click', () => {
      const m = document.getElementById('card-preview-modal');
      if (m) m.classList.remove('open');
    });
    if (btnCloseCardBottom) btnCloseCardBottom.addEventListener('click', () => {
      const m = document.getElementById('card-preview-modal');
      if (m) m.classList.remove('open');
    });
    if (cardModalBackdrop) cardModalBackdrop.addEventListener('click', () => {
      const m = document.getElementById('card-preview-modal');
      if (m) m.classList.remove('open');
    });
    if (btnDownloadCard) btnDownloadCard.addEventListener('click', downloadAnniversaryCard);

    // --- 14. Global Touch Heart Sparkle & Chime ---
    window.addEventListener('pointerdown', (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;
      spawnTouchHearts(e.clientX, e.clientY);
    }, { passive: true });

    // Initial check with server
    checkAndSyncServerData(false);

    // Auto-polling for multi-device sync every 8 seconds
    setInterval(() => {
      checkAndSyncServerData(false);
    }, 8000);

    // Also sync whenever user switches back to this browser tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkAndSyncServerData(false);
      }
    });
  }

  // DOM Content Loaded entry point
  window.addEventListener('DOMContentLoaded', initApp);
})();
