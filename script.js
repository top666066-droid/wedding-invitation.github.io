// ===============================
// Halaheel Invitation - Main JS
// ===============================

(function applyInvitationData() {
    if (typeof INVITATION === "undefined") return;

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "";
    };

    setText(
        "coverNames",
        `${INVITATION.groom} & ${INVITATION.bride}`
    );

    setText("groomName", INVITATION.groom);
    setText("brideName", INVITATION.bride);
    setText("eventDate", INVITATION.date);
    setText("eventTime", INVITATION.time);
    setText("eventSubtitle", INVITATION.subtitle);

    const title = document.getElementById("pageTitle");

    if (title) {
        title.textContent =
            `دعوة زفاف ${INVITATION.groom} & ${INVITATION.bride}`;
    }
})();


// ===============================
// Elements
// ===============================

const cover = document.getElementById("cover");
const door = document.getElementById("doorVid");
const hero = document.getElementById("heroVid");
const rings = document.getElementById("tapLayer");
const progress = document.getElementById("progress");

const dots = [
    ...document.querySelectorAll(".knocks span")
];

let taps = 0;
let opened = false;


// ===============================
// Knock Effect + Sound
// ===============================

function knock(x, y) {

    // Visual ring
    if (rings) {

        const ring = document.createElement("span");

        ring.className = "tapring";

        ring.style.left = x + "px";
        ring.style.top = y + "px";

        rings.appendChild(ring);

        setTimeout(() => {
            ring.remove();
        }, 750);
    }


    // Small vibration
    if (navigator.vibrate) {
        try {
            navigator.vibrate(35);
        } catch (e) {}
    }


    // Knock sound
    try {

        const AudioCtx =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioCtx) return;

        const audio = new AudioCtx();

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();

        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(
            125,
            audio.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            75,
            audio.currentTime + 0.11
        );

        gain.gain.setValueAtTime(
            0.0001,
            audio.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.16,
            audio.currentTime + 0.008
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audio.currentTime + 0.14
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.15
        );

    } catch (e) {}
}


// ===============================
// Play Hero Video
// ===============================

function playHeroVideo() {

    if (!hero) return;

    try {

        hero.muted = true;
        hero.loop = true;
        hero.playsInline = true;

        const playPromise = hero.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    hero.classList.add("is-ready");

                })
                .catch(() => {

                    // Browser blocked autoplay.
                    // The poster will remain visible.

                    hero.classList.remove("is-ready");

                });
        }

    } catch (e) {}
}


// ===============================
// Open Door
// ===============================

function openDoor() {

    if (opened) return;

    opened = true;


    // Start hero video BEFORE
    // removing the door.

    playHeroVideo();


    // Start door closing animation

    if (cover) {
        cover.classList.add("is-playing");
    }


    setTimeout(() => {

        if (cover) {
            cover.classList.add("is-open");
        }

        // Make sure Hero is visible

        playHeroVideo();

    }, 650);
}


// ===============================
// Door Click / Touch
// ===============================

if (cover) {

    cover.addEventListener(
        "pointerdown",
        function (event) {

            if (opened) return;

            taps++;


            // Door movement

            cover.classList.add(
                "is-knocked"
            );

            setTimeout(() => {

                cover.classList.remove(
                    "is-knocked"
                );

            }, 180);


            // Light up dot

            if (dots[taps - 1]) {

                dots[taps - 1]
                    .classList.add("hit");
            }


            // Progress

            if (progress) {

                progress.textContent =
                    `${Math.min(taps, 3)} / 3`;
            }


            // Knock effect

            knock(
                event.clientX,
                event.clientY
            );


            // Third knock

            if (taps >= 3) {

                try {

                    if (door) {

                        door.muted = true;

                        const p = door.play();

                        if (p !== undefined) {
                            p.catch(() => {});
                        }
                    }

                } catch (e) {}


                setTimeout(
                    openDoor,
                    300
                );
            }

        }
    );
}


// ===============================
// Hero Video Ready
// ===============================

if (hero) {

    hero.addEventListener(
        "canplay",
        function () {

            hero.classList.add(
                "is-ready"
            );

        }
    );


    hero.addEventListener(
        "loadeddata",
        function () {

            hero.classList.add(
                "is-ready"
            );

        }
    );


    // If the video finishes for any reason,
    // start it again.

    hero.addEventListener(
        "ended",
        function () {

            try {
                hero.currentTime = 0;
                hero.play().catch(() => {});
            } catch (e) {}

        }
    );
}
