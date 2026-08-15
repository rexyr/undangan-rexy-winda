
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCrC7exTwOwC9WMUTnUPKlyhow7iXqIHmHvdKl14k4E4RDTqTaZs9MzO3fkyq1ee6Wlg/exec";
    document.addEventListener("DOMContentLoaded", () => {
      // 1. Parameter URL untuk Nama Tamu (?to=Nama+Tamu) & AUTO-FILL RSVP FORM
      const urlParams = new URLSearchParams(window.location.search);
      const guestParam = urlParams.get('to');
      if (guestParam) {
        const guestNameEl = document.getElementById('guest-name');
        if (guestNameEl) guestNameEl.innerText = guestParam;
        const rsvpNameInput = document.getElementById('rsvp-name');
        if (rsvpNameInput) {
          rsvpNameInput.value = guestParam;
        }
      }
      // 2. Pre-Build Karakter Bounce Typing (Mencegah Layout Collapse / Flicker)
      function setupTypingContainers() {
        const containers = document.querySelectorAll(".typing-container");
        containers.forEach(container => {
          const lines = container.querySelectorAll(".line");
          let globalCharIndex = 0;
          lines.forEach(line => {
            if (line.dataset.prepared) return;
            const text = line.textContent.trim();
            line.textContent = "";
            text.split("").forEach(char => {
              const span = document.createElement("span");
              if (char === " ") {
                span.className = "space";
              } else {
                span.className = "char";
                span.textContent = char;
                span.style.setProperty("--char-index", globalCharIndex);
                globalCharIndex++;
              }
              line.appendChild(span);
            });
            line.dataset.prepared = "true";
          });
        });
      }
      setupTypingContainers();
      // Jalankan animasi awal pada cover
      setTimeout(() => {
        document.getElementById("bounce-target-1")?.classList.add("is-active");
        document.getElementById("bounce-couple")?.classList.add("is-active");
        document.getElementById("bounce-guest")?.classList.add("is-active");
      }, 100);

      // 3. Tombol Buka Undangan & Music Control
      const coverSection = document.getElementById("cover-section");
      const openBtn = document.getElementById("btn-open-invitation");
      const mainContent = document.getElementById("main-content");
      const bgMusic = document.getElementById("bg-music");
      const musicControl = document.getElementById("music-control");
      const donutsSvg = document.getElementById("music-icon");
      let isPlaying = false;
      if (openBtn) {
        openBtn.addEventListener("click", () => {
          if (mainContent) mainContent.classList.remove("content-hidden");
          if (musicControl) musicControl.classList.remove("d-none");
          if (coverSection) {
            coverSection.classList.add("fade-out");
            setTimeout(() => { coverSection.style.display = "none"; }, 600);
          }
          document.body.classList.remove("no-scroll");
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (bgMusic) {
            bgMusic.currentTime = 40;
            bgMusic.play().then(() => {
              isPlaying = true;
              if (donutsSvg) donutsSvg.classList.add("playing");
            }).catch(e => console.log("Autoplay dicegah browser:", e));
          }
          document.getElementById("bounce-target-2")?.classList.add("is-active");
        });
      }
      if (musicControl) {
        musicControl.addEventListener("click", () => {
          if (!bgMusic) return;
          if (isPlaying) {
            bgMusic.pause();
            if (donutsSvg) donutsSvg.classList.remove("playing");
          } else {
            bgMusic.play();
            if (donutsSvg) donutsSvg.classList.add("playing");
          }
          isPlaying = !isPlaying;
        });
      }

      // 4. Countdown Timer (Target: 6 September 2026 08:00 WIB)
      const eventDate = new Date("September 6, 2026 08:00:00").getTime();
      setInterval(() => {
        const now = new Date().getTime();
        const diff = eventDate - now;
        if (diff > 0) {
          document.getElementById("days").innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
          document.getElementById("hours").innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
          document.getElementById("minutes").innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
          document.getElementById("seconds").innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
      }, 1000);

      // 5. Scroll Observer dengan Hysteresis (Deadband) Anti-Kedip & Animasi Timeline Love Story
      const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const target = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
            target.classList.add('revealed', 'active');
            if (target.classList.contains('std-text-wrapper')) {
              target.classList.add('animate');
            }
            const galleryGrid = target.querySelector('#gallery-grid') || (target.id === 'gallery-grid' ? target : null);
            if (galleryGrid) galleryGrid.classList.add('revealed');
            const typingContainers = target.querySelectorAll('.typing-container');
            typingContainers.forEach(tc => tc.classList.add("is-active"));
            const disco = target.querySelector('.disco-wrapper') || (target.classList.contains('disco-wrapper') ? target : null);
            if (disco) disco.classList.add('revealed');
            const dateCircle = target.querySelector('.date-circle-container') || (target.classList.contains('date-circle-container') ? target : null);
            if (dateCircle) dateCircle.classList.add('revealed');
          } else if (!entry.isIntersecting || entry.intersectionRatio <= 0.02) {
            target.classList.remove('revealed', 'active');
            if (target.classList.contains('std-text-wrapper')) {
              target.classList.remove('animate');
            }
            const galleryGrid = target.querySelector('#gallery-grid') || (target.id === 'gallery-grid' ? target : null);
            if (galleryGrid) galleryGrid.classList.remove('revealed');
            const typingContainers = target.querySelectorAll('.typing-container');
            typingContainers.forEach(tc => tc.classList.remove("is-active"));
            const disco = target.querySelector('.disco-wrapper') || (target.classList.contains('disco-wrapper') ? target : null);
            if (disco) disco.classList.remove('revealed');
            const dateCircle = target.querySelector('.date-circle-container') || (target.classList.contains('date-circle-container') ? target : null);
            if (dateCircle) dateCircle.classList.remove('revealed');
          }
        });
      }, {
        rootMargin: "0px",
        threshold: [0.01, 0.06, 0.12, 0.2]
      });

      // Mengamati elemen scroll reveal dan tiap item timeline love story
      document.querySelectorAll('.scroll-reveal, .std-section-wrapper, .date-circle-container, .disco-wrapper, .std-text-wrapper, #gallery-section, .timeline-item')
        .forEach(el => scrollObserver.observe(el));

      // 6. Muat Ucapan
      loadWishes();
    });

    // Format Waktu Ucapan
    function formatDate(rawDate) {
      if (!rawDate) return "Baru saja";
      const date = new Date(rawDate);
      return isNaN(date.getTime())
        ? rawDate
        : date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
    }

    // 7. Salin Nomor Rekening + Popup Toast
    let toastTimer;
    function copyRekening(accNo, btn) {
      navigator.clipboard.writeText(accNo).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check me-1"></i> Tersalin`;
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        const toast = document.getElementById("copy-toast");
        if (toast) {
          toast.classList.add("show");
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => {
            toast.classList.remove("show");
          }, 2500);
        }
      });
    }

    // 8. Load Data RSVP Google Sheets (GET)
    async function loadWishes() {
      const wishesContainer = document.getElementById("wishes-container");
      if (!wishesContainer) return;
      wishesContainer.innerHTML = `
        <div class="text-center py-3 text-muted small">
          <div class="spinner-border spinner-border-sm text-secondary mb-2" role="status"></div>
          <p class="mb-0">Memuat ucapan & doa...</p>
        </div>
      `;
      try {
        const response = await fetch(SCRIPT_URL);
        const result = await response.json();
        if (result.status === "success") {
          if (!result.data || result.data.length === 0) {
            wishesContainer.innerHTML = `<p class="text-center text-muted small my-3">Belum ada ucapan. Jadilah yang pertama!</p>`;
            return;
          }
          wishesContainer.innerHTML = result.data.map(item => {
            const isHadir = item.hadir === "Hadir";
            const badgeClass = isHadir
              ? "bg-success-subtle text-success border border-success-subtle"
              : "bg-secondary-subtle text-secondary border border-secondary-subtle";
            return `
              <div class="p-3 mb-2 bg-light bg-opacity-75 rounded-3 border">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-bold text-dark small">${item.nama}</span>
                  <span class="badge rounded-pill ${badgeClass}" style="font-size: 0.7rem;">${item.hadir}</span>
                </div>
                <p class="text-secondary small mb-1" style="white-space: pre-line;">${item.ucapan}</p>
                <div class="text-muted" style="font-size: 0.65rem;">
                  ${formatDate(item.timestamp)}
                </div>
              </div>
            `;
          }).join("");
        }
      } catch (error) {
        wishesContainer.innerHTML = `<p class="text-center text-danger small">Gagal memuat ucapan.</p>`;
      }
    }

    // 9. Kirim Data Ucapan Form (POST)
    const rsvpForm = document.getElementById("rsvp-form");
    if (rsvpForm) {
      rsvpForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Mengirim...`;
        const guestName = document.getElementById("rsvp-name").value.trim();
        const guestStatus = document.getElementById("rsvp-status").value;
        const guestMessage = document.getElementById("rsvp-message").value.trim();
        const wishesContainer = document.getElementById("wishes-container");
        try {
          const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ nama: guestName, hadir: guestStatus, ucapan: guestMessage }),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
          });
          const resJson = await response.json();
          if (resJson.status === "success") {
            rsvpForm.reset();
            const urlParams = new URLSearchParams(window.location.search);
            const guestParam = urlParams.get('to');
            if (guestParam) {
              document.getElementById("rsvp-name").value = guestParam;
            }
            document.getElementById('modal-guest-name').textContent = guestName ? `Kak ${guestName}` : "Anda";
            new bootstrap.Modal(document.getElementById('successModal')).show();
            const badgeClass = guestStatus === "Hadir"
              ? "bg-success-subtle text-success border border-success-subtle"
              : "bg-secondary-subtle text-secondary border border-secondary-subtle";
            const newWish = `
              <div class="p-3 mb-2 bg-light bg-opacity-75 rounded-3 border">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-bold text-dark small">${guestName}</span>
                  <span class="badge rounded-pill ${badgeClass}" style="font-size: 0.7rem;">${guestStatus}</span>
                </div>
                <p class="text-secondary small mb-1" style="white-space: pre-line;">${guestMessage}</p>
                <div class="text-muted" style="font-size: 0.65rem;">Baru saja</div>
              </div>
            `;
            if (wishesContainer.innerHTML.includes("Belum ada ucapan")) {
              wishesContainer.innerHTML = newWish;
            } else {
              wishesContainer.insertAdjacentHTML("afterbegin", newWish);
            }
          }
        } catch (err) {
          alert("Terjadi gangguan koneksi saat mengirim ucapan.");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    }
