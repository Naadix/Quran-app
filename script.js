const prev = document.getElementById('prev'),
    next = document.getElementById('next'),
    play = document.getElementById('play'),
    surahName = document.getElementById('name-surah'),
    faPuase = document.querySelector('.fa-pause'),
    faPlay = document.querySelector('.fa-play'),
    surahs = document.querySelector('.surahs'),
    darkLight = document.querySelector('.dark-light'),
    sun = document.querySelector('.sun'),
    moon = document.querySelector('.moon');

// dark mode 
darkLight.addEventListener('click', () => {
    sun.classList.toggle('my-hidden');
    moon.classList.toggle('my-hidden');
    document.documentElement.classList.toggle('dark');

});



//  pause and play icon 
play.addEventListener('click', () => {
    faPuase.classList.toggle('my-hidden');
    faPlay.classList.toggle('my-hidden');
});


// Function Get Surahs Via API
async function getSurah() {
    let url = 'https://quran-endpoint.vercel.app/quran';
    try {
        let response = await fetch(url);
        let data = await response.json();
        for (let surah in data.data) {
            surahs.innerHTML += `
                <div
          class="all-surahs flex justify-between items-center cursor-pointer bg-[#1c2f41] w-[350px] h-[130px] p-2 rounded-2xl hover:bg-[#26435e] hover:scale-105 transition-all duration300">
          <div class="flex items-center gap-2">
            <div
              class=" flex justify-center items-center h-12 w-12 rounded-xl bg-cyan-400 text-white text-xl font-bold">
              ${data.data[surah].number}
            </div>
            <div class="flex flex-col items-center">
              <h3 class=" text-white text-2xl">${data.data[surah].asma.ar.short}</h3>
              <span class=" text-gray-300 text-xl">${data.data[surah].asma.en.short}</span>
            </div>
          </div>
          <div class="flex flex-col items-center gap-1">
            <div
              class=" bg-green-500 text-gray-200 py-1 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 ">
              ${data.data[surah].type.ar}</div>
            <span class=" text-gray-400">${data.data[surah].ayahCount} ايات</span>
          </div>
        </div>
        `;


            let audio;
            let surahAudio = [];
            const allSurahs = document.querySelectorAll('.all-surahs');
            allSurahs.forEach((surah, index) => {
                surahAudio.push(surah);
                surah.addEventListener('click', async () => {
                    if (audio && !audio.paused) {
                        audio.pause();
                    }
                    let response = await fetch(`https://quran-endpoint.vercel.app/quran/${index + 1}`);
                    let data = await response.json();
                    let audios = data.data.recitation;
                    let currSurah = audios;
                    audio = new Audio(currSurah.full);
                    surahName.innerText = `${data.data.asma.ar.long}`;
                    audio.play();


                    // Change icon when the click of surah 
                    faPuase.classList.remove('my-hidden');
                    faPlay.classList.add('my-hidden');

                    
                    // Control of Audio Surah
                    faPlay.addEventListener('click', () => {
                        audio.play();
                    })
                    faPuase.addEventListener('click', () => {
                        audio.pause()
                    })
                    audio.addEventListener('ended', () => {
                        faPlay.classList.remove('my-hidden');
                        faPuase.classList.add('my-hidden');
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            background: "#4b9ee9",
                            color: "fff",
                            title: "انتهت السورة ✅",
                            customClass: {
                                popup: "rounded-3xl",
                                title: "font-semibold text-white",
                            },
                            showConfirmButton: false,
                            timer: 2000
                        });
                    });

                });
            });
            // navigation to the next or prev surah
            let currIdx = 0;
            next.addEventListener('click', () => {
                audio.pause()
                if (currIdx < allSurahs.length) {
                    currIdx++;
                    allSurahs[currIdx].click();
                }
            });
            prev.addEventListener('click', () => {
                audio.pause();
                if (currIdx > 0) {
                    currIdx--;
                    allSurahs[currIdx].click();
                } else {
                    faPlay.classList.remove('my-hidden');
                    faPuase.classList.add('my-hidden');
                }
            });
        }
    } catch (error) {
        console.error(error);
    }

}
getSurah();