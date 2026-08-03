// ============================================
// INJEKSI CSS PRINT FIX & STICKY HEADER
// ============================================
if (!document.getElementById('print-fix-style-v15')) {
    const style = document.createElement('style');
    style.id = 'print-fix-style-v15';
    style.innerHTML = `
        @page { size: A4 portrait; margin: 0; }
        @page landscape_page { size: A4 landscape; margin: 0; }
        
        html { scroll-behavior: smooth; }

        @media print {
            html, body, main, section, #print-area, #dynamic-preview-container {
                display: block !important; height: auto !important; min-height: auto !important;
                overflow: visible !important; position: static !important; margin: 0 !important;
                padding: 0 !important; background-color: white !important;
            }
            .print-hide, aside, #form-tab, #editor-tab, #preview-header-wrapper, #toast-container, #login-screen, #custom-prompt-modal {
                display: none !important;
            }
            .preview-page-kertas {
                display: block !important; 
            }
            .paper-a4 {
                width: 210mm !important; height: 296.5mm !important; max-height: 296.5mm !important;
                margin: 0 !important; padding: 15mm !important; box-sizing: border-box !important;
                page-break-after: always !important; page-break-inside: avoid !important; break-after: page !important;
                overflow: hidden !important; border: none !important; box-shadow: none !important;
            }
            .paper-a4-landscape {
                page: landscape_page !important; width: 296.5mm !important; height: 209.5mm !important; max-height: 209.5mm !important;
                margin: 0 !important; padding: 15mm !important; box-sizing: border-box !important;
                page-break-after: always !important; page-break-inside: avoid !important; break-after: page !important;
                overflow: hidden !important; border: none !important; box-shadow: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// PENGATURAN LOGO & VARIABEL GLOBAL
// ============================================
// Path Logo sudah disesuaikan untuk struktur flat GitHub
const URL_LOGO_KIRI = 'telkom.jpg'; 
const URL_LOGO_KANAN = 'infra.jpg'; 

function setGlobalLogos() {
    const fallbackLogo = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"%3E%3Crect width="200" height="80" fill="%23fdf2f8"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="14" fill="%23db2777" text-anchor="middle" dy=".3em"%3ELOGO%3C/text%3E%3C/svg%3E';
    document.querySelectorAll('.out-logo-kiri').forEach(img => { if (!img.getAttribute('src')) { img.src = URL_LOGO_KIRI; img.onerror = () => { img.src = fallbackLogo; }; } img.classList.remove('hidden'); });
    document.querySelectorAll('.out-logo-kanan').forEach(img => { if (!img.getAttribute('src')) { img.src = URL_LOGO_KANAN; img.onerror = () => { img.src = fallbackLogo; }; } img.classList.remove('hidden'); });
}

function applyGlobalParaf() {
    if(window.globalParafTif) { document.querySelectorAll('.img-paraf-kiri').forEach(img => { img.src = window.globalParafTif; img.classList.remove('hidden'); }); document.querySelectorAll('.txt-paraf-kiri').forEach(txt => txt.style.display = 'none'); }
    if(window.globalParafTa) { document.querySelectorAll('.img-paraf-kanan').forEach(img => { img.src = window.globalParafTa; img.classList.remove('hidden'); }); document.querySelectorAll('.txt-paraf-kanan').forEach(txt => txt.style.display = 'none'); }
}

window.isAbdEdited = false; window.isUt1Edited = false; window.isTkpEdited = false;
window.globalParafTif = null; window.globalParafTa = null; window.previewObserver = null;
window.pageOrder = []; window.pageConfigs = {};

const PAGE_TITLES = {
    1: 'Cover', 2: 'Daftar Isi', 3: 'BAK TKP', 4: 'UT-1', 5: 'BOQ',
    6: 'Eviden 1 (Hal 6)', 7: 'OPM Utama', 8: 'OPM Lanjut 1', 9: 'OPM Lanjut 2',
    10: 'OPM Lanjut 3', 11: 'OPM Lanjut 4', 12: 'Eviden 2', 13: 'Eviden 3',
    14: 'Eviden 4', 15: 'Eviden 5', 16: 'Eviden 6', 17: 'Eviden 7',
    18: 'Eviden 8', 19: 'Eviden 9', 20: 'Eviden 10', 21: 'Eviden 11',
    22: 'OTDR 1', 23: 'OTDR 2', 24: 'OTDR 3', 25: 'OTDR 4', 26: 'OTDR 5',
    27: 'ABD', 28: 'KML', 29: 'MANCORE'
};

for(let i=1; i<=29; i++) {
    window.pageOrder.push(i.toString());
    window.pageConfigs[i.toString()] = { title: PAGE_TITLES[i], isDup: false };
}

function startApp() {
    const splash = document.getElementById('login-screen');
    splash.classList.add('opacity-0');
    setTimeout(() => { splash.classList.add('hidden'); switchTab('form-tab'); switchForm('1'); }, 500);
}

function showCustomToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `px-6 py-4 rounded shadow-lg text-white text-sm font-bold transition-all duration-500 transform translate-x-full ${isError ? 'bg-red-500' : 'bg-red-600'}`;
    toast.innerText = message; container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
    setTimeout(() => { toast.classList.add('opacity-0', 'translate-x-full'); setTimeout(() => toast.remove(), 500); }, 4000);
}

function switchTab(tabId) {
    ['form-tab', 'editor-tab', 'report-tab'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    
    document.querySelectorAll('aside nav button').forEach(btn => {
        btn.classList.remove('bg-red-600', 'text-white', 'shadow'); btn.classList.add('bg-white', 'text-red-600');
    });
    const activeBtn = Array.from(document.querySelectorAll('aside nav button')).find(btn => btn.getAttribute('onclick').includes(tabId));
    if(activeBtn) {
        activeBtn.classList.add('bg-red-600', 'text-white', 'shadow'); activeBtn.classList.remove('bg-white', 'text-red-600');
    }

    if(tabId === 'report-tab') {
        document.querySelectorAll('.preview-page-kertas').forEach(el => {
            el.classList.remove('hidden');
            el.style.display = '';
        });
        
        document.querySelectorAll('#preview-nav-container button').forEach(btn => {
            if(btn.id === 'btn-prev-all') {
                btn.className = "flex-shrink-0 px-3 py-2 bg-red-100 text-red-800 border border-red-400 rounded font-bold transition text-xs sm:text-sm shadow-md sticky left-0 z-10";
            } else {
                btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm";
            }
        });
        
        initScrollSpy();
        const scroller = document.getElementById('main-scroller');
        if(scroller) scroller.scrollTo({ top: 0, behavior: "instant" });
    }
}

function switchForm(page) {
    try {
        page = page.toString();
        document.querySelectorAll('.form-page-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('[id^="btn-form-"]').forEach(btn => {
            btn.className = "flex-shrink-0 py-2 px-3 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm";
        });

        const activePage = document.getElementById('form-page-' + page);
        const activeBtn = document.getElementById('btn-form-' + page);
        if (activePage) activePage.classList.remove('hidden');
        if (activeBtn) {
            activeBtn.className = "flex-shrink-0 py-2 px-3 bg-red-600 text-white rounded shadow font-bold transition text-xs sm:text-sm";
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        updateBottomNav(page);
    } catch(e) {
        console.error("Gagal berpindah tab form:", e);
    }
}

function switchPreview(page) {
    try {
        page = page.toString();
        const scroller = document.getElementById('main-scroller');
        if (!scroller) return;

        document.querySelectorAll('#preview-nav-container button').forEach(btn => {
            if(btn.id === 'btn-prev-all') {
                btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm sticky left-0 z-10";
            } else {
                btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm";
            }
        });

        const allPages = document.querySelectorAll('.preview-page-kertas');

        if(page === 'all') {
            const allBtn = document.getElementById('btn-prev-all');
            if(allBtn) allBtn.className = "flex-shrink-0 px-3 py-2 bg-red-100 text-red-800 border border-red-400 rounded font-bold transition text-xs sm:text-sm shadow-md sticky left-0 z-10";
            
            allPages.forEach(p => {
                p.classList.remove('hidden');
                p.style.display = 'block'; 
            });
            
            scroller.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => { initScrollSpy(); }, 500);
            return;
        }

        if(window.previewObserver) window.previewObserver.disconnect();

        const targetPage = document.getElementById('preview-page-' + page);
        const activeBtn = document.getElementById('btn-prev-' + page);

        if(targetPage) {
            allPages.forEach(p => {
                p.classList.add('hidden');
                p.style.display = 'none'; 
            });
            
            targetPage.classList.remove('hidden');
            targetPage.style.display = 'block'; 
            
            if (activeBtn) {
                activeBtn.className = "flex-shrink-0 px-3 py-2 bg-red-600 text-white rounded shadow-md font-bold transition text-xs sm:text-sm";
                activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
            
            scroller.scrollTo({ top: 0, behavior: "instant" });
        }
    } catch(e) {
        console.error("Gagal melakukan navigasi preview:", e);
    }
}

function initScrollSpy() {
    if(window.previewObserver) window.previewObserver.disconnect();
    
    window.previewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageId = entry.target.id.replace('preview-page-', '');
                document.querySelectorAll('#preview-nav-container button').forEach(btn => {
                    if(btn.id === 'btn-prev-all') {
                        btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm sticky left-0 z-10";
                    } else {
                        btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm";
                    }
                });
                const activeBtn = document.getElementById('btn-prev-' + pageId);
                if (activeBtn) {
                    activeBtn.className = "flex-shrink-0 px-3 py-2 bg-red-600 text-white rounded shadow font-bold transition text-xs sm:text-sm";
                    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });
    }, {
        root: document.getElementById('main-scroller'),
        rootMargin: '-30% 0px -50% 0px', 
        threshold: 0
    });

    document.querySelectorAll('.preview-page-kertas').forEach(page => { window.previewObserver.observe(page); });
}

function renderDynamicNav() {
    const formNav = document.getElementById('form-nav-container'); const prevNav = document.getElementById('preview-nav-container');
    if(!formNav || !prevNav) return;

    formNav.innerHTML = '';
    prevNav.innerHTML = `<button type="button" onclick="switchPreview('all')" id="btn-prev-all" class="flex-shrink-0 px-3 py-2 bg-white text-red-600 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm border border-red-500 shadow-sm sticky left-0 z-10">👁️ Tampil Semua</button>`;

    let displayNum = 1;
    window.pageOrder.forEach((id) => {
        let config = window.pageConfigs[id];
        let titleFormat = config.isDup ? `Hal ${displayNum} (Dup)` : `Hal ${displayNum} (${config.title})`;
        
        formNav.innerHTML += `<button type="button" onclick="switchForm('${id}')" id="btn-form-${id}" class="flex-shrink-0 py-2 px-3 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm">${titleFormat}</button>`;
        prevNav.innerHTML += `<button type="button" onclick="switchPreview('${id}')" id="btn-prev-${id}" class="flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm">${titleFormat}</button>`;
        
        displayNum++;
    });
}

function updateBottomNav(id) {
    const idx = window.pageOrder.indexOf(id); if(idx === -1) return;
    const page = document.getElementById('form-page-' + id); if(!page) return;

    let btnPrev = page.querySelector('.btn-nav-prev'); let btnNext = page.querySelector('.btn-nav-next');
    const btnContainer = page.querySelector('.mt-8.flex');
    if(btnContainer && (!btnPrev || !btnNext)) {
        btnContainer.innerHTML = `<button type="button" class="btn-nav-prev bg-white border border-red-500 text-red-600 px-6 py-2 rounded font-medium hover:bg-red-50 hidden">⬅️ Prev</button><button type="button" class="btn-nav-next bg-red-600 text-white px-6 py-2 rounded font-medium hover:bg-red-700 shadow hidden">Next ➡️</button>`;
        btnPrev = page.querySelector('.btn-nav-prev'); btnNext = page.querySelector('.btn-nav-next'); btnContainer.classList.add('justify-between');
    }

    if(btnPrev) {
        if(idx > 0) {
            btnPrev.classList.remove('hidden');
            let prevTitle = window.pageConfigs[window.pageOrder[idx-1]].isDup ? "Duplikat" : window.pageConfigs[window.pageOrder[idx-1]].title;
            btnPrev.innerText = `⬅️ Kembali (${prevTitle})`;
            btnPrev.onclick = () => switchForm(window.pageOrder[idx-1]);
        } else { btnPrev.classList.add('hidden'); }
    }
    if(btnNext) {
        if(idx < window.pageOrder.length - 1) {
            btnNext.classList.remove('hidden', 'bg-green-600', 'hover:bg-green-700'); btnNext.classList.add('bg-red-600', 'hover:bg-red-700');
            let nextTitle = window.pageConfigs[window.pageOrder[idx+1]].isDup ? "Duplikat" : window.pageConfigs[window.pageOrder[idx+1]].title;
            btnNext.innerText = `Lanjut (${nextTitle}) ➡️`;
            btnNext.onclick = () => switchForm(window.pageOrder[idx+1]);
        } else {
            btnNext.classList.remove('hidden', 'bg-red-600', 'hover:bg-red-700'); btnNext.classList.add('bg-green-600', 'hover:bg-green-700');
            btnNext.innerText = "Lihat Preview & Cetak 📄"; btnNext.onclick = () => cetakPDF();
        }
    }
}

// ============================================
// TEMPLATE HTML UNTUK PREVIEW
// ============================================
function tplHeader(title) {
    return `
    <div class="relative w-full h-8 mb-2 shrink-0">
        <img src="" class="h-6 lg:h-8 absolute left-0 top-[-8px] object-contain out-logo-kiri">
        <img src="" class="h-6 lg:h-8 absolute right-0 top-[-8px] object-contain out-logo-kanan">
    </div>
    <div class="text-center w-full mb-2 shrink-0">
        <h1 class="text-[13px] md:text-sm font-bold leading-tight uppercase">${title}</h1>
    </div>
    <div class="border-t-2 border-black mb-[2px] shrink-0"></div>
    <div class="border-t border-black mb-2 shrink-0"></div>`;
}

function tplInfo() {
    return `
    <div class="font-bold leading-snug w-full mb-3 uppercase text-[11px]">
        <div class="flex"><div class="w-[170px]">PROYEK</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
        <div class="flex"><div class="w-[170px]">KONTRAK</div><div class="w-4 text-center">:</div><div class="flex-1 val-kontrak">-</div></div>
        <div class="flex"><div class="w-[170px]">SP</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
        <div class="flex"><div class="w-[170px]">DISTRICT</div><div class="w-4 text-center">:</div><div class="flex-1 val-district">-</div></div>
        <div class="flex"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
        <div class="flex"><div class="w-[170px]">PELAKSANA</div><div class="w-4 text-center">:</div><div class="flex-1 val-pelaksana">-</div></div>
    </div>
    <div class="border-t-2 border-black mb-4"></div>`;
}

function tplTTD(marginClass = "mt-12") {
    return `
    <div class="w-full ${marginClass} flex justify-between px-8 text-center font-bold text-[11px] pb-4 shrink-0">
        <div class="w-[200px]">
            <p class="mb-4"></p>
            <p class="uppercase val-pihak1-perusahaan">-</p>
            <p class="uppercase val-pihak1-jabatan">-</p>
            <div class="h-16 my-2 relative flex justify-center items-center">
                <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kiri">...ttd...</span>
                <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-ttd-kiri" style="padding: 2px;">
            </div>
            <p class="underline uppercase val-pihak1-nama">-</p>
            <p>NIK. <span class="val-pihak1-nik">-</span></p>
        </div>
        <div class="w-[200px]">
            <p><span class="uppercase val-tempat-ttd">-</span>, <span class="uppercase val-tgl-ttd">-</span></p>
            <p class="uppercase mt-2 val-pihak2-perusahaan">-</p>
            <p class="uppercase val-pihak2-jabatan">-</p>
            <div class="h-16 my-2 relative flex justify-center items-center">
                <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kanan">...ttd...</span>
                <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-ttd-kanan" style="padding: 2px;">
                </div>
            <p class="underline uppercase val-pihak2-nama">-</p>
            <p>NIK. <span class="val-pihak2-nik">-</span></p>
        </div>
    </div>`;
}

function tplParaf() {
    return `
    <div class="w-full mt-auto flex justify-end pt-4 shrink-0 pb-4">
        <table class="border-collapse border border-black text-[10px] text-center font-bold bg-white" style="width: 150px;">
            <tr><td class="border border-black py-1 w-1/2">PARAF TIF</td><td class="border border-black py-1 w-1/2">PARAF TA</td></tr>
            <tr>
                <td class="border border-black p-1 align-middle">
                    <div class="relative w-full h-14 flex items-center justify-center bg-white">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-paraf-kiri">...</span>
                        <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-paraf-kiri" style="padding: 2px;">
                    </div>
                </td>
                <td class="border border-black p-1 align-middle">
                    <div class="relative w-full h-14 flex items-center justify-center bg-white">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-paraf-kanan">...</span>
                        <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-paraf-kanan" style="padding: 2px;">
                    </div>
                </td>
            </tr>
        </table>
    </div>`;
}

function generateDynamicPreviewPages() {
    const formContainer = document.getElementById('dynamic-form-pages-container');
    const prevContainer = document.getElementById('dynamic-preview-container');
    if(!formContainer || !prevContainer) return;
    
    formContainer.innerHTML = '';
    prevContainer.innerHTML = '';

    // FORM OPM
    for(let i=7; i<=11; i++) {
        let isUtama = (i === 7);
        formContainer.insertAdjacentHTML('beforeend', `
        <div id="form-page-${i}" class="hidden form-page-content">
            <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">LAMPIRAN DATA OPM ${isUtama ? '(UTAMA)' : `(LANJUTAN ${i-7})`}</h3>
            ${isUtama ? `
                <div class="grid grid-cols-3 gap-4 mb-3"><label class="text-sm text-red-900">WAVE LENGTH</label><input type="text" id="inp-opm7-wave" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900" value="1310/1490 nm *)"></div>
                <div class="grid grid-cols-3 gap-4 mb-3"><label class="text-sm text-red-900">TIPE KABEL</label><input type="text" id="inp-opm7-kabel" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900 uppercase" value="SINGLE MODE G. 652 D"></div>
                <div class="grid grid-cols-3 gap-4 mb-3"><label class="text-sm text-red-900">JUMLAH CORE</label><input type="text" id="inp-opm7-core" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900 uppercase" value="12 CORE"></div>
                <div class="grid grid-cols-3 gap-4 mb-5"><label class="text-sm text-red-900">CATUAN</label><input type="text" id="inp-opm7-catuan" oninput="updateReport()" class="col-span-2 border border-red-200 rounded p-2 focus:ring-red-500 outline-none text-red-900 uppercase" value="ODC-DMP-FAE"></div>
            ` : `<p class="text-xs text-red-600 mb-4 bg-white p-2 border border-red-200 rounded">*Data spesifikasi otomatis mengikuti isian dari Halaman 7 (Utama).</p>`}
            <div class="bg-red-50 p-4 border border-red-100 rounded mt-4">
                <label class="text-sm font-bold text-red-900">Upload Tabel OPM ${i-6}</label>
                <input type="file" id="inp-img-opm${i}" data-target="out-opm${i}-tabel-img" accept="image/*" class="w-full mt-2 border border-red-200 bg-white p-2 text-sm rounded cursor-pointer text-red-800">
            </div>
            <div class="mt-8 flex justify-between"></div>
        </div>`);

        prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-${i}" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN DATA PENGUKURAN OPM')}
            <div class="font-bold leading-snug w-full mb-3 uppercase text-[11px]">
                <div class="flex italic"><div class="w-[170px]">WAVE LENGTH</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-wave">1310/1490 nm *)</div></div>
                <div class="flex"><div class="w-[170px]">PROJECT</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
                <div class="flex"><div class="w-[170px]">SP</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
                <div class="flex"><div class="w-[170px]">TIPE KABEL</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-kabel">-</div></div>
                <div class="flex"><div class="w-[170px]">JUMLAH CORE</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-core">-</div></div>
                <div class="flex"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
                <div class="flex"><div class="w-[170px]">CATUAN</div><div class="w-4 text-center">:</div><div class="flex-1" id="out-opm${i}-catuan">-</div></div>
            </div>
            <div class="border-t-2 border-black mb-4"></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4 mt-4">
                <img id="out-opm${i}-tabel-img" class="max-w-full max-h-[140mm] object-contain hidden">
            </div>
            ${tplTTD('mt-12')}
        </div>`);
    }

    // EVIDEN
    for(let i=12; i<=21; i++) {
        let evIdx = i - 10;
        let isLanjutan = (i % 2 !== 0); 
        let numSlots = isLanjutan ? 3 : 9; 
        
        formContainer.insertAdjacentHTML('beforeend', `
        <div id="form-page-${i}" class="hidden form-page-content">
            <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">EVIDEN OPM (GRID) - Hal ${i}</h3>
            <div class="bg-red-50 p-4 mb-6 rounded border border-red-100">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-bold text-sm text-red-900">${isLanjutan ? `Upload Foto Lanjutan (Maks 2 Foto)` : `Upload Foto (Maks 9 Foto)`}</label>
                </div>
                <div class="border-2 border-dashed border-red-300 p-6 rounded-lg text-center bg-white mb-4 relative overflow-hidden group hover:border-red-500 hover:bg-red-50 cursor-pointer" id="drop-ev${evIdx}" onclick="document.getElementById('hidden-file-input-global').click(); window.currentUploaderId = 'ev${evIdx}';">
                    <div class="pointer-events-none"><span class="text-4xl block mb-2">📸</span><p class="text-red-700 text-sm font-bold">Tarik & Lepas foto ke sini</p></div>
                    <input type="file" id="file-ev${evIdx}" multiple accept="image/*" class="hidden">
                </div>
                <div id="grid-ev${evIdx}" class="grid ${isLanjutan ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-4"></div>
            </div>
            <div class="mt-8 flex justify-between"></div>
        </div>`);

        prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-${i}" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN EVIDENT HASIL UKUR OPM')}
            ${tplInfo()}
            <div class="grid grid-cols-3 gap-0 border-t border-l border-black w-full mb-4 flex-none">
                ${Array(numSlots).fill(0).map((_, gridIdx) => `
                <div class="border-r border-b border-black flex flex-col p-1 h-[60mm]">
                    ${(isLanjutan && gridIdx === 2) ? `<div class="flex-1 bg-gray-50 opacity-50 min-h-0"></div>` : `<div class="flex-1 flex justify-center items-center overflow-hidden min-h-0"><img id="out-ev${evIdx}-img-${gridIdx+1}" class="w-full h-full object-cover hidden"></div>`}
                    <div class="border-t border-black text-center font-bold text-[10px] py-1 uppercase" ${(isLanjutan && gridIdx === 2) ? '' : `id="out-ev${evIdx}-cap-${gridIdx+1}"`}>${(isLanjutan && gridIdx === 2) ? '' : 'PORT'}</div>
                </div>
                `).join('')}
            </div>
            ${tplParaf()}
        </div>`);
    }

    // OTDR
    for(let i=22; i<=26; i++) {
        formContainer.insertAdjacentHTML('beforeend', `
        <div id="form-page-${i}" class="hidden form-page-content">
            <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">DATA REPORT HASIL UKUR OTDR (HAL ${i})</h3>
            <div class="bg-red-50 p-4 rounded border border-red-100 mb-6">
                <h4 class="font-bold text-sm text-red-900 mb-2">Upload Gambar Report OTDR</h4>
                <input type="file" id="inp-img-otdr${i}-full" data-target="out-otdr${i}-img-full" accept="image/*" class="w-full border border-red-200 bg-white p-2 rounded text-sm cursor-pointer text-red-800">
            </div>
            <div class="mt-8 flex justify-between"></div>
        </div>`);

        prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-${i}" class="paper-a4 hidden page-break text-[11px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('REPORT HASIL UKUR OTDR')}
            ${tplInfo()}
            <div class="w-full flex-1 flex justify-center items-center overflow-hidden mb-6 min-h-0"><img id="out-otdr${i}-img-full" class="max-w-full max-h-full object-contain hidden"></div>
            ${tplParaf()}
        </div>`);
    }

    // PENTING: HALAMAN 1 SD 6 DIINJEK KE AWAL PREVIEW CONTAINER MENGGUNAKAN INSERTADJACENTHTML
    prevContainer.insertAdjacentHTML('afterbegin', `
        <div id="preview-page-1" class="paper-a4 text-[13px] font-sans relative preview-page-kertas">
            <div class="w-full">
                <div class="relative flex justify-between items-start mb-6">
                    <img src="" alt="Logo Kiri" class="h-6 lg:h-7 absolute left-0 top-[-8px] object-contain out-logo-kiri">
                    <img src="" alt="Logo Kanan" class="h-6 lg:h-7 absolute right-0 top-[-8px] object-contain out-logo-kanan">
                </div>
                <div class="text-center mb-5 pt-4"><h1 class="text-xl font-bold mt-2">DOKUMEN BERITA ACARA UJI TERIMA (BAUT)</h1></div>
                <div class="border-t border-black mb-[2px]"></div><div class="border-t border-black mb-6"></div>
                <div class="font-bold leading-relaxed w-full uppercase">
                    <div class="flex mb-1"><div class="w-[170px]">PROYEK</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">KONTRAK</div><div class="w-4 text-center">:</div><div class="flex-1 val-kontrak">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">SURAT PESANAN</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">DISTRICT</div><div class="w-4 text-center">:</div><div class="flex-1 val-district">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
                    <div class="flex mb-1"><div class="w-[170px]">PELAKSANA</div><div class="w-4 text-center">:</div><div class="flex-1 val-pelaksana">-</div></div>
                </div>
            </div>
            <div class="w-full flex justify-center mt-28 mb-16"><img src="" class="w-[450px] object-contain out-logo-kanan"></div>
            <div class="w-full text-center text-[15px] md:text-[17px] font-bold space-y-7">
                <p>ANTARA</p>
                <p class="uppercase val-pihak1-perusahaan">-</p>
                <p>DENGAN</p>
                <p class="uppercase val-pihak2-perusahaan">-</p>
            </div>
        </div>

        <div id="preview-page-2" class="paper-a4 hidden page-break font-sans relative preview-page-kertas">
            <div class="relative flex justify-between items-start mb-16">
                <img src="" class="h-6 lg:h-7 absolute left-0 top-[-8px] object-contain out-logo-kiri">
                <img src="" class="h-6 lg:h-7 absolute right-0 top-[-8px] object-contain out-logo-kanan">
            </div>
            <div class="text-center mb-16 pt-4">
                <h1 class="text-2xl font-bold leading-snug">DAFTAR ISI<br>DOKUMEN BERITA ACARA UJI TERIMA<br>(BAUT)</h1>
            </div>
            <div class="px-20"><div id="out-daftar-isi" class="text-[15px] font-bold space-y-6"></div></div>
        </div>

        <div id="preview-page-3" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BERITA ACARA KRONOLOGIS TAMBAH KURANG PEKERJAAN')}
            ${tplInfo()}
            <div class="leading-relaxed text-justify mb-2 whitespace-pre-wrap" id="out-tkp-p1"></div>
            <div class="leading-relaxed text-justify mb-1 whitespace-pre-wrap" id="out-tkp-p2"></div>
            <div class="leading-relaxed mb-1 ml-4"><p>A. Rekapitulasi Nilai Pekerjaan</p></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4"><img id="out-tkp-img-rekap" class="max-w-full max-h-[80mm] object-contain hidden"></div>
            <div class="leading-relaxed mb-1 ml-4"><p>B. Tambah Kurang Volume Material</p></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4"><img id="out-tkp-img-material" class="max-w-full max-h-[80mm] object-contain hidden"></div>
            <p class="mb-2 text-justify">Demikian Berita Acara ini dibuat untuk dipergunakan seperlunya.</p>
            ${tplTTD('mt-10')}
        </div>

        <div id="preview-page-4" class="paper-a4 hidden page-break text-[13px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BERITA ACARA<br>UJI TERIMA PERTAMA')}
            ${tplInfo()}
            <div class="leading-relaxed text-justify mb-6 flex"><div class="w-8">1.</div><div class="flex-1 whitespace-pre-wrap" id="out-ut1-p1"></div></div>
            <div class="leading-relaxed text-justify mb-8 flex">
                <div class="w-8">2.</div>
                <div class="flex-1"><p>Pekerjaan tersebut telah / belum sesuai dengan spesifikasi PT Telkom Infrastruktur Indonesia yang ditentukan di dalam Perjanjian Pemborongan tersebut dan secara teknis dapat dinyatakan:</p><div class="text-center font-bold text-base mt-4">DITERIMA / <del>DITOLAK</del></div></div>
            </div>
            <div class="leading-relaxed text-justify flex">
                <div class="w-8">3.</div>
                <div class="flex-1"><p>Hal-hal yang masih perlu diselesaikan / disempurnakan selama masa perbaikan / pemeliharaan dapat dilihat pada halaman atau lembar catatan hasil uji terima pertama.</p></div>
            </div>
            ${tplTTD('mt-6')}
        </div>

        <div id="preview-page-5" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BOQ UJI TERIMA')}
            ${tplInfo()}
            <div class="w-full flex justify-center items-center overflow-hidden mb-2 mt-4"><img id="out-boq-tabel-img" class="max-w-full max-h-[150mm] object-contain hidden"></div>
            ${tplTTD('mt-6')}
        </div>

        <div id="preview-page-6" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN EVIDENT UJI TERIMA')}
            ${tplInfo()}
            <div class="grid grid-cols-3 gap-0 border-t border-l border-black w-full mb-4 flex-none">
                ${Array(9).fill(0).map((_, gridIdx) => `
                <div class="border-r border-b border-black flex flex-col p-1 h-[60mm]">
                    <div class="flex-1 flex justify-center items-center overflow-hidden min-h-0"><img id="out-ev1-img-${gridIdx+1}" class="w-full h-full object-cover hidden"></div>
                    <div class="border-t border-black text-center font-bold text-[10px] py-1 uppercase" id="out-ev1-cap-${gridIdx+1}">PORT</div>
                </div>
                `).join('')}
            </div>
            ${tplParaf()}
        </div>
    `);

    // ABD, KML, MANCORE
    prevContainer.insertAdjacentHTML('beforeend', `
        <div id="preview-page-27" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('BERITA ACARA AS BUILD DRAWING (ABD)')}
            ${tplInfo()}
            <div class="leading-relaxed text-justify mb-4 text-[11px] whitespace-pre-wrap" id="out-abd-paragraf"></div>
            <div class="w-full flex justify-center items-center overflow-hidden mb-4 mt-2"><img id="out-abd-img-table" class="max-w-full max-h-[120mm] object-contain hidden"></div>
            <div class="leading-relaxed text-justify mb-4 text-[11px]">Selanjutnya, Tim SDI akan melakukan proses penggambaran pada Aplikasi GE SMALL WORLD paling lambat 7 hari.</div>
            <div class="leading-relaxed text-justify mb-4 text-[11px]">Demikian tanda terima ABD ini dibuat sesuai dengan keadaan yang sebenar - benarnya.</div>
            
            <div class="w-full mt-6 flex justify-between px-8 text-center font-bold text-[11px] pb-4 shrink-0">
                <div class="w-[200px]">
                    <p class="mb-4"></p>
                    <p class="uppercase" id="out-abd-perusahaan1">-</p>
                    <p class="uppercase" id="out-abd-jabatan1">-</p>
                    <div class="h-16 my-2 relative flex justify-center items-center">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kiri">...ttd...</span>
                        <img id="out-abd-img-ttd1" class="absolute inset-0 w-full h-full object-contain hidden z-10 img-ttd-kiri" style="padding: 2px;">
                    </div>
                    <p class="underline uppercase" id="out-abd-nama1">-</p>
                    <p>NIK. <span id="out-abd-nik1">-</span></p>
                </div>
                <div class="w-[200px]">
                    <p><span class="uppercase val-tempat-ttd">-</span>, <span class="uppercase val-tgl-ttd">-</span></p>
                    <p class="uppercase mt-2 val-pihak2-perusahaan">-</p>
                    <p class="uppercase val-pihak2-jabatan">-</p>
                    <div class="h-16 my-2 relative flex justify-center items-center">
                        <span class="text-[10px] text-gray-300 font-normal italic z-0 txt-ttd-kanan">...ttd...</span>
                        <img class="absolute inset-0 w-full h-full object-contain hidden z-10 img-ttd-kanan" style="padding: 2px;">
                    </div>
                    <p class="underline uppercase val-pihak2-nama">-</p>
                    <p>NIK. <span class="val-pihak2-nik">-</span></p>
                </div>
            </div>
        </div>
        
        <div id="preview-page-28" class="paper-a4-landscape hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN KML')}
            ${tplInfo()}
            <div class="w-full flex-1 flex justify-center items-center overflow-hidden mb-4 min-h-0"><img id="out-kml-img-table" class="max-w-full max-h-full object-contain hidden"></div>
            ${tplParaf()}
        </div>
        
        <div id="preview-page-29" class="paper-a4-landscape hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
            ${tplHeader('LAMPIRAN MANCORE')}
            ${tplInfo()}
            <div class="w-full flex-1 flex justify-center items-center overflow-hidden mb-4 min-h-0"><img id="out-mancore-img-table" class="max-w-full max-h-full object-contain hidden"></div>
            ${tplParaf()}
        </div>
    `);
}

function injectFormActions() {
    document.querySelectorAll('.form-page-content').forEach(page => {
        const pageId = page.id.replace('form-page-', '');
        let header = page.querySelector('.page-header') || page.querySelector('h3.bg-red-100') || page.querySelector('.bg-red-100.border-l-4');
        
        if(header && !header.querySelector('.orient-select')) {
            const isLand = (pageId === '28' || pageId === '29');
            const actionHTML = `
                <div class="float-right flex items-center gap-1 sm:gap-2 ml-2 mt-[-4px] absolute right-2 top-2 z-10">
                    <select class="orient-select bg-white border border-red-300 text-red-800 text-[10px] sm:text-xs font-bold rounded px-1 sm:px-2 py-1 cursor-pointer outline-none" data-page="${pageId}">
                        <option value="portrait" ${!isLand ? 'selected' : ''}>📄 Potrait</option>
                        <option value="landscape" ${isLand ? 'selected' : ''}>🗎 Landscape</option>
                    </select>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', actionHTML);
        }
    });
}

document.addEventListener('change', (e) => {
    if(e.target.classList.contains('orient-select')) {
        const pageId = e.target.getAttribute('data-page');
        const type = e.target.value;
        const page = document.getElementById(`preview-page-${pageId}`);
        if(page) {
            if(type === 'landscape') {
                page.classList.remove('paper-a4'); page.classList.add('paper-a4-landscape');
            } else {
                page.classList.remove('paper-a4-landscape'); page.classList.add('paper-a4');
            }
        }
    }
});

function duplikatHalaman(currentId) {
    const formEl = document.getElementById('form-page-' + currentId);
    const prevEl = document.getElementById('preview-page-' + currentId);
    if(!formEl || !prevEl) return;

    const newId = currentId + '_d' + Date.now();
    const cloneForm = formEl.cloneNode(true);
    const clonePrev = prevEl.cloneNode(true);

    const oldIds = [];
    cloneForm.querySelectorAll('[id]').forEach(el => oldIds.push(el.id));
    clonePrev.querySelectorAll('[id]').forEach(el => oldIds.push(el.id));
    oldIds.sort((a,b) => b.length - a.length);

    let formHtml = cloneForm.innerHTML;
    let prevHtml = clonePrev.innerHTML;

    oldIds.forEach(oldId => {
        const regex = new RegExp(oldId, 'g');
        const newElementId = oldId + '_' + newId;
        formHtml = formHtml.replace(regex, newElementId);
        prevHtml = prevHtml.replace(regex, newElementId);
    });

    cloneForm.innerHTML = formHtml;
    clonePrev.innerHTML = prevHtml;
    cloneForm.id = 'form-page-' + newId;
    clonePrev.id = 'preview-page-' + newId;

    const header = cloneForm.querySelector('.page-header') || cloneForm.querySelector('h3');
    if(header) {
        const delBtn = header.querySelector('.btn-hapus');
        if(delBtn) delBtn.remove();
        
        const actionDiv = header.querySelector('.absolute.right-2.top-2');
        if(actionDiv) {
            actionDiv.insertAdjacentHTML('beforeend', `<button type="button" onclick="hapusHalaman('${newId}')" class="btn-hapus bg-red-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow hover:bg-red-700 transition ml-1">🗑️ Hapus</button>`);
        }
    }

    const selectOrient = cloneForm.querySelector('.orient-select');
    if(selectOrient) selectOrient.setAttribute('data-page', newId);

    formEl.insertAdjacentElement('afterend', cloneForm);
    prevEl.insertAdjacentElement('afterend', clonePrev);

    const currentIndex = window.pageOrder.indexOf(currentId.toString());
    window.pageOrder.splice(currentIndex + 1, 0, newId);

    const baseConfig = window.pageConfigs[currentId.toString()];
    window.pageConfigs[newId] = { title: baseConfig.title, isDup: true };

    cloneForm.querySelectorAll('input, textarea, select').forEach(input => {
        if(input.type !== 'file' && !input.classList.contains('orient-select')) {
            input.addEventListener('input', () => {
                const outId = input.id.replace('inp-', 'out-');
                const outEl = document.getElementById(outId);
                if(outEl) {
                    if(outEl.tagName === 'INPUT' || outEl.tagName === 'TEXTAREA') outEl.value = input.value;
                    else outEl.innerText = input.value;
                }
            });
        } else if (input.type === 'file') {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        let targetId = input.getAttribute('data-target');
                        if(targetId) {
                            const outEl = document.getElementById(targetId);
                            if(outEl) {
                                outEl.src = event.target.result;
                                outEl.classList.remove('hidden');
                                const parent = outEl.parentElement;
                                if(parent && parent.querySelector('span')) parent.querySelector('span').style.display = 'none';
                            }
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });

    cloneForm.querySelectorAll('.border-dashed').forEach(dropZone => {
        if(dropZone.id && dropZone.id.startsWith('drop-ev')) {
            const newEvId = dropZone.id.replace('drop-', ''); 
            const originalEvId = newEvId.split('_')[0]; 
            const uploaderMax = (originalEvId === 'ev1' || parseInt(originalEvId.replace('ev','')) % 2 === 0) ? 9 : 2; 
            setTimeout(() => {
                window[newEvId + 'Uploader'] = new PhotoUploader(newEvId, uploaderMax, `out-${newEvId}`, []);
            }, 100);
        }
    });

    updateReport();
    renderDynamicNav();
    switchForm(newId);
    initScrollSpy();
    showCustomToast("Halaman berhasil diduplikat!", false);
}

function hapusHalaman(id) {
    if(!confirm("Yakin ingin menghapus halaman ini?")) return;
    
    const formEl = document.getElementById('form-page-' + id);
    const prevEl = document.getElementById('preview-page-' + id);
    if(formEl) formEl.remove();
    if(prevEl) prevEl.remove();

    const idx = window.pageOrder.indexOf(id.toString());
    if(idx > -1) {
        window.pageOrder.splice(idx, 1);
        delete window.pageConfigs[id.toString()];
        renderDynamicNav();
        switchForm(window.pageOrder[idx - 1] || window.pageOrder[0]);
        initScrollSpy();
    }
}

// ============================================
// LOGIKA MODAL POP-UP TAMBAH HALAMAN
// ============================================

function tambahHalamanCustom() {
    try {
        let maxPos = window.pageOrder.length;
        let maxPageEl = document.getElementById('modal-max-page');
        if (maxPageEl) maxPageEl.innerText = maxPos;
        
        let inputEl = document.getElementById('custom-prompt-input');
        if (inputEl) inputEl.value = '';
        
        const modal = document.getElementById('custom-prompt-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex'; 
        }
        
        setTimeout(() => {
            if (inputEl) inputEl.focus();
        }, 100);
    } catch (e) {
        console.error("Gagal memuat fungsi popup:", e);
    }
}

function closePromptModal() {
    const modal = document.getElementById('custom-prompt-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none'; 
    }
}

function submitPromptModal() {
    let userInput = document.getElementById('custom-prompt-input').value.trim().toLowerCase();
    
    closePromptModal();
    
    if (userInput === 'baru' || userInput === '') {
        buatHalamanBlank(); 
    } else {
        let targetIdx = parseInt(userInput) - 1;
        if (!isNaN(targetIdx) && targetIdx >= 0 && targetIdx < window.pageOrder.length) {
            let currentId = window.pageOrder[targetIdx];
            if(currentId === '6') {
                alert("Halaman Pengaturan Eviden Global (Hal 6) tidak perlu diduplikat.");
                return;
            }
            duplikatHalaman(currentId);
        } else {
            showCustomToast("Nomor halaman tidak valid atau tidak ditemukan!", true);
        }
    }
}

function buatHalamanBlank() {
    const pageId = 'c' + Date.now();
    window.pageOrder.push(pageId);
    window.pageConfigs[pageId] = { title: 'Custom Baru', isDup: true };

    const formContainer = document.getElementById('dynamic-form-pages-container');
    formContainer.insertAdjacentHTML('beforeend', `
    <div id="form-page-${pageId}" class="hidden form-page-content">
        <h3 class="font-semibold text-red-700 mb-3 bg-red-100 border-l-4 border-red-600 p-2 rounded-r relative overflow-hidden pr-32 page-header">
            HALAMAN CUSTOM 
            <div class="float-right flex items-center gap-1 sm:gap-2 ml-2 mt-[-4px] absolute right-2 top-2 z-10">
                <select class="orient-select bg-white border border-red-300 text-red-800 text-[10px] sm:text-xs font-bold rounded px-1 sm:px-2 py-1 cursor-pointer outline-none" data-page="${pageId}">
                    <option value="portrait" selected>📄 Potrait</option>
                    <option value="landscape">🗎 Landscape</option>
                </select>
                <button type="button" onclick="hapusHalaman('${pageId}')" class="btn-hapus bg-red-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow hover:bg-red-700 transition ml-1">🗑️ Hapus</button>
                </div>
        </h3>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-1">Judul Halaman (Header Tengah)</label>
            <input type="text" id="inp-custom-${pageId}-judul" oninput="updateReport()" class="w-full border border-red-200 rounded p-2 focus:ring-2 focus:ring-red-500 outline-none uppercase text-red-900 font-bold text-center" value="BERITA ACARA CUSTOM">
        </div>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-1">Paragraf Atas</label>
            <textarea id="inp-custom-${pageId}-p1" oninput="updateReport()" rows="3" class="w-full border border-red-200 bg-white p-2 rounded text-sm focus:ring-2 focus:ring-red-500 outline-none leading-relaxed text-justify text-red-900">Masukkan paragraf pengantar di sini...</textarea>
        </div>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-2">Upload Gambar / Eviden</label>
            <div id="drop-custom${pageId}" class="border-2 border-dashed border-red-300 p-6 rounded-lg text-center bg-white mb-4 relative overflow-hidden group hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer" onclick="document.getElementById('hidden-file-input-global').click(); window.currentUploaderId = 'custom${pageId}';">
                <div class="pointer-events-none"><span class="text-4xl block mb-2">📸</span><p class="text-red-700 text-sm font-bold">Tarik & Lepas foto ke sini</p></div>
                <input type="file" id="file-custom${pageId}" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            </div>
            <div id="grid-custom${pageId}" class="grid grid-cols-2 md:grid-cols-3 gap-4"></div>
        </div>
        <div class="bg-red-50 p-4 rounded border border-red-100 mb-4">
            <label class="block font-bold text-sm text-red-900 mb-1">Paragraf Bawah</label>
            <textarea id="inp-custom-${pageId}-p2" oninput="updateReport()" rows="2" class="w-full border border-red-200 bg-white p-2 rounded text-sm focus:ring-2 focus:ring-red-500 outline-none leading-relaxed text-justify text-red-900">Demikian berita acara ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</textarea>
        </div>
        <div class="bg-red-100 p-4 rounded border border-red-300 mb-6 shadow-sm">
            <label class="block font-bold text-sm text-red-900 mb-2">Jenis Penandatanganan</label>
            <div class="flex gap-4 mb-4 pb-4 border-b border-red-200">
                <label class="flex items-center gap-1 cursor-pointer text-sm font-medium"><input type="radio" name="ttdtype-${pageId}" value="ttd" checked onchange="changeTtdType('${pageId}', 'ttd')"> TTD Lengkap</label>
                <label class="flex items-center gap-1 cursor-pointer text-sm font-medium"><input type="radio" name="ttdtype-${pageId}" value="paraf" onchange="changeTtdType('${pageId}', 'paraf')"> Tabel Paraf</label>
            </div>
            <div id="form-ttd-wrapper-${pageId}" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3 p-3 bg-white border border-red-200 rounded">
                    <h4 class="font-bold text-xs text-red-800 border-b border-red-100 pb-1">KIRI</h4>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Perusahaan</label><input type="text" id="inp-custom-${pageId}-perusahaan1" oninput="updateReport()" value="PT. TELKOM INFRASTRUKTUR INDONESIA" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Jabatan</label><input type="text" id="inp-custom-${pageId}-jabatan1" oninput="updateReport()" value="TIM UJI TERIMA" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Nama</label><input type="text" id="inp-custom-${pageId}-nama1" oninput="updateReport()" value="NAMA PIHAK KIRI" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">NIK</label><input type="text" id="inp-custom-${pageId}-nik1" oninput="updateReport()" value="123456" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Upload TTD</label><input type="file" id="inp-custom-${pageId}-ttd1" data-target="out-custom-${pageId}-img-ttd1" accept="image/*" class="w-full border border-red-200 bg-red-50 p-1 rounded text-xs cursor-pointer text-red-800"></div>
                </div>
                <div class="space-y-3 p-3 bg-white border border-red-200 rounded">
                    <h4 class="font-bold text-xs text-red-800 border-b border-red-100 pb-1">KANAN</h4>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Perusahaan</label><input type="text" id="inp-custom-${pageId}-perusahaan2" oninput="updateReport()" value="PT. TELKOM AKSES" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Jabatan</label><input type="text" id="inp-custom-${pageId}-jabatan2" oninput="updateReport()" value="TIM UJI TERIMA" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Nama</label><input type="text" id="inp-custom-${pageId}-nama2" oninput="updateReport()" value="NAMA PIHAK KANAN" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">NIK</label><input type="text" id="inp-custom-${pageId}-nik2" oninput="updateReport()" value="654321" class="w-full border border-red-200 rounded p-1.5 outline-none text-sm uppercase"></div>
                    <div><label class="block text-xs font-bold text-red-700 mb-1">Upload TTD</label><input type="file" id="inp-custom-${pageId}-ttd2" data-target="out-custom-${pageId}-img-ttd2" accept="image/*" class="w-full border border-red-200 bg-red-50 p-1 rounded text-xs cursor-pointer text-red-800"></div>
                </div>
            </div>
            <div id="form-paraf-wrapper-${pageId}" class="hidden space-y-3 p-3 bg-white border border-red-200 rounded">
                 <p class="text-xs text-red-600 mb-2">*Tabel Paraf akan otomatis mengikuti Paraf Global di Hal 6.</p>
                 <div class="grid grid-cols-2 gap-4">
                     <div><label class="block text-xs font-bold text-red-700 mb-1">Header Kiri</label><input type="text" id="inp-custom-${pageId}-paraf-kiri" oninput="updateReport()" value="PARAF TIF" class="w-full border p-1.5 text-sm uppercase"></div>
                     <div><label class="block text-xs font-bold text-red-700 mb-1">Header Kanan</label><input type="text" id="inp-custom-${pageId}-paraf-kanan" oninput="updateReport()" value="PARAF TA" class="w-full border p-1.5 text-sm uppercase"></div>
                 </div>
            </div>
        </div>
        <div class="mt-8 flex justify-between"></div>
    </div>`);

    const prevContainer = document.getElementById('dynamic-preview-container');
    prevContainer.insertAdjacentHTML('beforeend', `
    <div id="preview-page-${pageId}" class="paper-a4 hidden page-break text-[12px] font-sans flex flex-col relative preview-page-kertas">
        <div class="relative w-full h-8 lg:h-10 mb-2 shrink-0"><img src="" class="h-6 lg:h-8 absolute left-0 top-0 object-contain out-logo-kiri"><img src="" class="h-6 lg:h-8 absolute right-0 top-0 object-contain out-logo-kanan"></div><div class="text-center w-full mb-2 shrink-0"><h1 class="text-[13px] md:text-sm font-bold leading-tight uppercase" id="out-custom-${pageId}-judul">BERITA ACARA CUSTOM</h1></div><div class="border-t-2 border-black mb-[2px] shrink-0"></div><div class="border-t border-black mb-2 shrink-0"></div>
        <div class="font-bold leading-snug w-full mb-3 uppercase text-[11px]">
            <div class="flex"><div class="w-[170px]">PROYEK</div><div class="w-4 text-center">:</div><div class="flex-1 val-proyek">-</div></div>
            <div class="flex"><div class="w-[170px]">KONTRAK</div><div class="w-4 text-center">:</div><div class="flex-1 val-kontrak">-</div></div>
            <div class="flex"><div class="w-[170px]">SURAT PESANAN</div><div class="w-4 text-center">:</div><div class="flex-1 val-sp">-</div></div>
            <div class="flex"><div class="w-[170px]">DISTRICT</div><div class="w-4 text-center">:</div><div class="flex-1 val-district">-</div></div>
            <div class="flex"><div class="w-[170px]">LOKASI</div><div class="w-4 text-center">:</div><div class="flex-1 val-lokasi">-</div></div>
            <div class="flex"><div class="w-[170px]">PELAKSANA</div><div class="w-4 text-center">:</div><div class="flex-1 val-pelaksana">-</div></div>
        </div>
        <div class="border-t-2 border-black mb-4"></div>
        <div class="leading-relaxed text-justify mb-4 whitespace-pre-wrap" id="out-custom-${pageId}-p1">Masukkan paragraf pengantar di sini...</div>
        <div id="out-custom${pageId}-grid-wrapper" class="w-full flex-none mb-4 min-h-0" style="display: none;">
            ${Array(9).fill(0).map((_, gridIdx) => `
            <div id="out-custom${pageId}-cell-${gridIdx+1}" class="border-r border-b border-black flex flex-col p-1 h-[60mm] custom-grid-item-${pageId}">
                <div class="flex-1 flex justify-center items-center overflow-hidden min-h-0"><img id="out-custom${pageId}-img-${gridIdx+1}" class="w-full h-full object-cover hidden"></div>
                <div class="border-t border-black text-center font-bold text-[10px] py-1 uppercase" id="out-custom${pageId}-cap-${gridIdx+1}">Foto ${gridIdx+1}</div>
            </div>
            `).join('')}
        </div>
        <div class="leading-relaxed text-justify mb-8 whitespace-pre-wrap" id="out-custom-${pageId}-p2">Demikian berita acara ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</div>
        
        <div id="preview-ttd-wrapper-${pageId}" class="w-full mt-12 flex justify-between px-8 text-center font-bold text-[11px] pb-4 shrink-0">
            <div class="w-[200px]"><p class="mb-4"></p><p class="uppercase" id="out-custom-${pageId}-perusahaan1">PT. TELKOM INFRASTRUKTUR INDONESIA</p><p class="uppercase" id="out-custom-${pageId}-jabatan1">TIM UJI TERIMA</p>
                <div class="h-16 my-2 relative flex justify-center items-center">
                    <span id="txt-ttd-kiri-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...ttd...</span>
                    <img id="out-custom-${pageId}-img-ttd1" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;">
                </div>
                <p class="underline uppercase" id="out-custom-${pageId}-nama1">NAMA</p><p>NIK. <span id="out-custom-${pageId}-nik1">123456</span></p>
            </div>
            <div class="w-[200px]"><p><span class="uppercase val-tempat-ttd">-</span>, <span class="uppercase val-tgl-ttd">-</span></p><p class="uppercase mt-2" id="out-custom-${pageId}-perusahaan2">PT. TELKOM AKSES</p><p class="uppercase" id="out-custom-${pageId}-jabatan2">TIM UJI TERIMA</p>
                <div class="h-16 my-2 relative flex justify-center items-center">
                    <span id="txt-ttd-kanan-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...ttd...</span>
                    <img id="out-custom-${pageId}-img-ttd2" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;">
                </div>
                <p class="underline uppercase" id="out-custom-${pageId}-nama2">NAMA</p><p>NIK. <span id="out-custom-${pageId}-nik2">654321</span></p>
            </div>
        </div>
        
        <div id="preview-paraf-wrapper-${pageId}" class="w-full mt-auto flex justify-end pt-4 shrink-0 hidden pb-4">
            <table class="border-collapse border border-black text-[10px] text-center font-bold bg-white" style="width: 150px;">
                <tr><td class="border border-black py-1 w-1/2" id="out-custom-${pageId}-paraf-kiri">PARAF TIF</td><td class="border border-black py-1 w-1/2" id="out-custom-${pageId}-paraf-kanan">PARAF TA</td></tr>
                <tr>
                    <td class="border border-black p-1 align-middle"><div class="relative w-full h-14 flex items-center justify-center bg-white"><span id="txt-paraf-tif-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...</span><img id="out-custom-${pageId}-paraf-img1" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;"></div></td>
                    <td class="border border-black p-1 align-middle"><div class="relative w-full h-14 flex items-center justify-center bg-white"><span id="txt-paraf-ta-custom-${pageId}" class="text-[10px] text-gray-300 font-normal italic z-0">...</span><img id="out-custom-${pageId}-paraf-img2" class="absolute inset-0 w-full h-full object-contain hidden z-10" style="padding: 2px;"></div></td>
                </tr>
            </table>
        </div>
    </div>`);

    setTimeout(() => {
        window[`custom${pageId}Uploader`] = new PhotoUploader(`custom${pageId}`, 9, `out-custom${pageId}`, ["Foto 1", "Foto 2", "Foto 3", "Foto 4", "Foto 5", "Foto 6", "Foto 7", "Foto 8", "Foto 9"]);
        setupImageUpload(`inp-custom-${pageId}-ttd1`, `out-custom-${pageId}-img-ttd1`, `txt-ttd-kiri-custom-${pageId}`);
        setupImageUpload(`inp-custom-${pageId}-ttd2`, `out-custom-${pageId}-img-ttd2`, `txt-ttd-kanan-custom-${pageId}`);
        
        applyGlobalParaf(); setGlobalLogos(); updateReport();
    }, 100);

    renderDynamicNav(); switchForm(pageId); initScrollSpy();
    showCustomToast("Halaman Custom Baru berhasil ditambahkan di akhir!", false);
}

function changeTtdType(pageId, type) {
    document.getElementById(`form-ttd-wrapper-${pageId}`).classList.toggle('hidden', type !== 'ttd');
    document.getElementById(`form-paraf-wrapper-${pageId}`).classList.toggle('hidden', type !== 'paraf');
    document.getElementById(`preview-ttd-wrapper-${pageId}`).classList.toggle('hidden', type !== 'ttd');
    document.getElementById(`preview-paraf-wrapper-${pageId}`).classList.toggle('hidden', type !== 'paraf');
}

// ============================================
// FUNGSI UNTUK HALAMAN 2 (DAFTAR ISI)
// ============================================
function tambahDaftarIsi() {
    let container;
    const activePage = document.querySelector('.form-page-content:not(.hidden)');
    if(activePage) {
        container = activePage.querySelector('[id^="container-daftar-isi"]');
    }
    if(!container) return;

    const newItem = document.createElement('div');
    newItem.className = "flex gap-2 items-center";
    newItem.innerHTML = `
        <input type="text" oninput="updateReport()" class="flex-1 border rounded p-2 focus:ring-2 outline-none uppercase" value="ITEM BARU">
        <button type="button" onclick="hapusDaftarIsi(this)" class="bg-white border text-red-600 px-3 py-2 rounded font-bold hover:bg-red-50 transition">X</button>
    `;
    
    container.appendChild(newItem);
    updateReport();
    showCustomToast("Item Daftar Isi berhasil ditambahkan!", false);
}

function hapusDaftarIsi(btnElement) {
    btnElement.parentElement.remove();
    updateReport();
}

// Data Utility Functions
function terbilang(angka) {
    const huruf = ["", "SATU", "DUA", "TIGA", "EMPAT", "LIMA", "ENAM", "TUJUH", "DELAPAN", "SEMBILAN", "SEPULUH", "SEBELAS"];
    if (angka < 12) return huruf[angka];
    if (angka < 20) return terbilang(angka - 10) + " BELAS";
    if (angka < 100) return terbilang(Math.floor(angka / 10)) + " PULUH " + terbilang(angka % 10);
    if (angka < 200) return "SERATUS " + terbilang(angka - 100);
    if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " RATUS " + terbilang(angka % 100);
    if (angka < 2000) return "SERIBU " + terbilang(angka - 1000);
    if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " RIBU " + terbilang(angka % 1000);
    return "";
}

function generateTerbilang() {
    const dateInput = document.getElementById('inp-tanggal')?.value;
    if(!dateInput) return;
    const dateObj = new Date(dateInput);
    const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
    const months = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    
    if(document.getElementById('inp-hari')) document.getElementById('inp-hari').value = days[dateObj.getDay()];
    if(document.getElementById('inp-tgl-teks')) document.getElementById('inp-tgl-teks').value = terbilang(dateObj.getDate()).trim();
    if(document.getElementById('inp-bln-teks')) document.getElementById('inp-bln-teks').value = months[dateObj.getMonth()];
    if(document.getElementById('inp-thn-teks')) document.getElementById('inp-thn-teks').value = terbilang(dateObj.getFullYear()).trim();
    updateReport();
}

function resetTkpText() { window.isTkpEdited = false; updateReport(); showCustomToast("Teks TKP dikembalikan ke otomatis.", false); }
function resetAbdText() { window.isAbdEdited = false; updateReport(); showCustomToast("Teks ABD dikembalikan ke otomatis.", false); }
function resetUt1Text() { window.isUt1Edited = false; updateReport(); showCustomToast("Teks UT-1 dikembalikan ke otomatis.", false); }

function getTkpTemplate() {
    const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value.toUpperCase() : '-';
    return {
        p1: `Pada hari ini ${getValue('inp-hari')}, tanggal ${getValue('inp-tgl-teks')} bulan ${getValue('inp-bln-teks')} tahun ${getValue('inp-thn-teks')}, bertempat di kantor TIF district ${getValue('inp-district')}. Telah dilakukan Kesepakatan Tambah Kurang Perkerjaan terhadap Kontrak Perjanjian ${getValue('inp-proyek')} Antara PT. Telkom Infrastruktur Indonesia (TIF) dengan ${getValue('inp-pelaksana')} selanjutnya disebut MITRA dengan kesepakatan sebagai berikut:`,
        p2: `Dalam hal ini bertindak untuk dan atas nama PT. Telkom Infrastruktur Indonesia, telah melaksanakan pemeriksaan dan evaluasi terhadap kondisi nyata lapangan, atas kendala/permasalahan pelaksanaan pekerjaan sebagai berikut.`
    };
}

function getAbdTemplate() {
    const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value.toUpperCase() : '-';
    return `Pada hari ini ${getValue('inp-hari')}, tanggal ${getValue('inp-tgl-teks')} bulan ${getValue('inp-bln-teks')} tahun ${getValue('inp-thn-teks')}, bertempat di ${getValue('inp-tempat-ttd')} telah diserahkan kelengkapan dokumen untuk pembuatan dokumen ABD Smallworld untuk Surat Pesanan ${getValue('inp-sp')} dari mitra ${getValue('inp-pelaksana')} kepada PT. TELKOM INFRASTRUKTUR INDONESIA Serta wakilnya yaitu Tim Survey Design Inventory (SDI) yang secara sah mewakili berdasarkan Kontrak ${getValue('inp-kontrak')} dengan lokasi sebagai berikut :`;
}

function getUt1Template() {
    const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value.toUpperCase() : '-';
    let tglTtdFormat = '...';
    const inputTgl = document.getElementById('inp-tanggal')?.value;
    if(inputTgl) {
        const dateObj = new Date(inputTgl);
        const months = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
        tglTtdFormat = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    }
    return {
        p1: `Berdasarkan hasil pemeriksaan / Uji Terima Pertama (UT-I), yang dilaksanakan tanggal ${tglTtdFormat} oleh Tim Uji Terima terhadap Pengadaan dan Pemasangan Surat Pesanan ${getValue('inp-sp')} yang dilaksanakan oleh ${getValue('inp-pelaksana')} yang terikat Perjanjian Pemborongan / Kontrak Nomor: ${getValue('inp-kontrak')}`
    };
}

function setupImageUpload(inputId, outputId, hideTextId = null) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    if (input && output) {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    output.src = event.target.result;
                    output.style.display = 'block';
                    output.classList.remove('hidden');
                    if(hideTextId && document.getElementById(hideTextId)) document.getElementById(hideTextId).style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// UPDATE CORE REPORTS (MENGGUNAKAN CLASS GLOBAL)
function updateReport() {
    const getValue = (id) => { const el = document.getElementById(id); return el ? el.value : '-'; };
    
    const setClassVal = (className, val) => {
        document.querySelectorAll('.' + className).forEach(el => {
            if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = val;
            else el.innerText = val;
        });
    };
    
    const vPro = getValue('inp-proyek'), vKon = getValue('inp-kontrak'), vSp = getValue('inp-sp'), vDis = getValue('inp-district'), vLok = getValue('inp-lokasi'), vPel = getValue('inp-pelaksana');

    setClassVal('val-proyek', vPro); setClassVal('val-kontrak', vKon); setClassVal('val-sp', vSp); setClassVal('val-district', vDis); setClassVal('val-lokasi', vLok); setClassVal('val-pelaksana', vPel);

    document.querySelectorAll('[id^="container-daftar-isi"]').forEach(containerInp => {
        const suffix = containerInp.id.replace('container-daftar-isi', '');
        const containerOut = document.getElementById('out-daftar-isi' + suffix);
        if(containerOut) {
            const inputsDaftarIsi = containerInp.querySelectorAll('input');
            containerOut.innerHTML = ''; 
            inputsDaftarIsi.forEach((input, index) => {
                if(input.value.trim() !== '') {
                    containerOut.innerHTML += `<div class="flex gap-3 uppercase"><span class="whitespace-nowrap">${index + 1}.</span> <span>${input.value}</span></div>`;
                }
            });
        }
    });

    const tTtd = getValue('inp-tempat-ttd');
    const p1P = getValue('inp-pihak1-perusahaan'), p1J = getValue('inp-pihak1-jabatan'), p1N = getValue('inp-pihak1-nama'), p1K = getValue('inp-pihak1-nik');
    const p2P = getValue('inp-pihak2-perusahaan'), p2J = getValue('inp-pihak2-jabatan'), p2N = getValue('inp-pihak2-nama'), p2K = getValue('inp-pihak2-nik');
    
    let tglFmt = '3 JUNI 2026';
    if(document.getElementById('inp-tanggal')?.value) {
        const d = new Date(document.getElementById('inp-tanggal').value);
        tglFmt = `${d.getDate()} ${["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"][d.getMonth()]} ${d.getFullYear()}`;
    }

    setClassVal('val-tempat-ttd', tTtd);
    setClassVal('val-tgl-ttd', tglFmt);
    
    setClassVal('val-pihak1-perusahaan', p1P);
    setClassVal('val-pihak1-jabatan', p1J);
    setClassVal('val-pihak1-nama', p1N);
    setClassVal('val-pihak1-nik', p1K);

    setClassVal('val-pihak2-perusahaan', p2P);
    setClassVal('val-pihak2-jabatan', p2J);
    setClassVal('val-pihak2-nama', p2N);
    setClassVal('val-pihak2-nik', p2K);

    if (document.getElementById('inp-tkp-p1') && !window.isTkpEdited) {
        const t = getTkpTemplate(); document.getElementById('inp-tkp-p1').value = t.p1; document.getElementById('inp-tkp-p2').value = t.p2;
    }
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    
    setVal('out-tkp-p1', getValue('inp-tkp-p1')); setVal('out-tkp-p2', getValue('inp-tkp-p2'));

    if (document.getElementById('inp-ut1-p1') && !window.isUt1Edited) document.getElementById('inp-ut1-p1').value = getUt1Template().p1;
    setVal('out-ut1-p1', getValue('inp-ut1-p1'));

    [7, 8, 9, 10, 11].forEach(i => {
        setVal(`out-opm${i}-wave`, getValue(`inp-opm7-wave`)); setVal(`out-opm${i}-kabel`, getValue(`inp-opm7-kabel`)); setVal(`out-opm${i}-core`, getValue(`inp-opm7-core`)); setVal(`out-opm${i}-catuan`, getValue(`inp-opm7-catuan`));
    });

    if (document.getElementById('inp-abd-paragraf') && !window.isAbdEdited) document.getElementById('inp-abd-paragraf').value = getAbdTemplate();
    setVal('out-abd-paragraf', getValue('inp-abd-paragraf'));
    
    setVal('out-abd-perusahaan1', getValue('inp-abd-kiri-perusahaan')); 
    setVal('out-abd-jabatan1', getValue('inp-abd-kiri-jabatan')); 
    setVal('out-abd-nama1', getValue('inp-abd-kiri-nama')); 
    setVal('out-abd-nik1', getValue('inp-abd-kiri-nik')); 

    window.pageOrder.forEach(pageId => {
        if(pageId.toString().startsWith('c') || pageId.toString().includes('_d')) {
            setVal(`out-custom-${pageId}-judul`, getValue(`inp-custom-${pageId}-judul`));
            setVal(`out-custom-${pageId}-p1`, getValue(`inp-custom-${pageId}-p1`));
            setVal(`out-custom-${pageId}-p2`, getValue(`inp-custom-${pageId}-p2`));
            
            setVal(`out-custom-${pageId}-perusahaan1`, getValue(`inp-custom-${pageId}-perusahaan1`));
            setVal(`out-custom-${pageId}-jabatan1`, getValue(`inp-custom-${pageId}-jabatan1`));
            setVal(`out-custom-${pageId}-nama1`, getValue(`inp-custom-${pageId}-nama1`));
            setVal(`out-custom-${pageId}-nik1`, getValue(`inp-custom-${pageId}-nik1`));
            setVal(`out-custom-${pageId}-perusahaan2`, getValue(`inp-custom-${pageId}-perusahaan2`));
            setVal(`out-custom-${pageId}-jabatan2`, getValue(`inp-custom-${pageId}-jabatan2`));
            setVal(`out-custom-${pageId}-nama2`, getValue(`inp-custom-${pageId}-nama2`));
            setVal(`out-custom-${pageId}-nik2`, getValue(`inp-custom-${pageId}-nik2`));
            setVal(`out-custom-${pageId}-paraf-kiri`, getValue(`inp-custom-${pageId}-paraf-kiri`));
            setVal(`out-custom-${pageId}-paraf-kanan`, getValue(`inp-custom-${pageId}-paraf-kanan`));
        }
    });
}

class PhotoUploader {
    constructor(id, maxPhotos, outPrefix, defaultCaptions = []) {
        this.id = id; this.maxPhotos = maxPhotos; this.outPrefix = outPrefix;
        this.defaultCaptions = defaultCaptions; this.photos = new Array(maxPhotos).fill(null); this.captions = [...defaultCaptions];
        this.fileInput = document.getElementById(`file-${id}`); this.gridContainer = document.getElementById(`grid-${id}`);
        this.initEvents(); this.render();
        if(this.outPrefix.startsWith('out-custom')) this.adjustCustomGridLayout();
    }
    
    initEvents() {
        if(this.fileInput) this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        const dropZone = document.getElementById(`drop-${this.id}`);
        if(dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => dropZone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); }, false));
            ['dragenter', 'dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add('bg-red-100', 'border-red-500'), false));
            ['dragleave', 'drop'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.remove('bg-red-100', 'border-red-500'), false));
            dropZone.addEventListener('drop', (e) => this.handleFiles(e.dataTransfer.files), false);
        }
    }
    
    handleFiles(files) {
        if(!files || files.length === 0) return;
        const newFiles = Array.from(files).filter(f => f.type.startsWith('image/')); let fileIdx = 0;
        for(let i=0; i<this.maxPhotos; i++) {
            if(!this.photos[i] && fileIdx < newFiles.length) { this.readAndSetFile(i, newFiles[fileIdx]); fileIdx++; }
        }
        if(fileIdx < newFiles.length) showCustomToast(`Hanya bisa menampung sisa maksimal ${this.maxPhotos} foto.`, true);
        if(this.fileInput) this.fileInput.value = '';
    }
    
    readAndSetFile(index, file) {
        const reader = new FileReader();
        reader.onload = (e) => { this.photos[index] = e.target.result; this.render(); this.updatePreview(index); };
        reader.readAsDataURL(file);
    }
    
    removePhoto(index) { this.photos[index] = null; this.render(); this.updatePreview(index); }
    
    triggerReplace(index) {
        let tempInput = document.getElementById('hidden-file-input-global');
        if (!tempInput) {
            tempInput = document.createElement('input'); tempInput.type = 'file'; tempInput.accept = 'image/*'; tempInput.id = 'hidden-file-input-global'; tempInput.style.position = 'absolute'; tempInput.style.opacity = '0'; tempInput.style.zIndex = '-1'; document.body.appendChild(tempInput);
        }
        tempInput.onchange = null; tempInput.value = ''; 
        tempInput.onchange = (e) => { if(e.target.files && e.target.files[0]) this.readAndSetFile(index, e.target.files[0]); };
        tempInput.click();
    }
    
    updateCaption(index, value) {
        this.captions[index] = value;
        const outCap = document.getElementById(`${this.outPrefix}-cap-${index+1}`);
        if(outCap) outCap.innerText = value;
    }
    
    updatePreview(index) {
        const outImg = document.getElementById(`${this.outPrefix}-img-${index+1}`);
        if(outImg) {
            if(this.photos[index]) { outImg.src = this.photos[index]; outImg.classList.remove('hidden'); }
            else { outImg.src = ''; outImg.classList.add('hidden'); }
        }
        if(this.outPrefix.startsWith('out-custom')) this.adjustCustomGridLayout();
    }

    adjustCustomGridLayout() {
        const wrapper = document.getElementById(`${this.outPrefix}-grid-wrapper`); if(!wrapper) return;
        const activeCount = this.photos.filter(p => p !== null).length;
        if(activeCount === 0) { wrapper.style.display = 'none'; } 
        else if(activeCount === 1) {
            wrapper.style.display = 'flex'; wrapper.className = "w-full flex-1 justify-center items-center overflow-hidden mb-4 min-h-0"; 
            for(let i=0; i<this.maxPhotos; i++) {
                const cell = document.getElementById(`${this.outPrefix}-cell-${i+1}`); const cap = document.getElementById(`${this.outPrefix}-cap-${i+1}`); const img = document.getElementById(`${this.outPrefix}-img-${i+1}`); 
                if(cell) {
                    if(this.photos[i]) { cell.style.display = 'flex'; cell.className = "w-full h-full justify-center items-center overflow-hidden min-h-0"; if(img) { img.className = "max-w-full max-h-full object-contain"; img.classList.remove('hidden'); } if(cap) cap.style.display = 'none'; } 
                    else { cell.style.display = 'none'; }
                }
            }
        } else {
            wrapper.style.display = 'grid'; let colsClass = (activeCount === 2 || activeCount === 4) ? 'grid-cols-2' : 'grid-cols-3'; wrapper.className = `grid ${colsClass} gap-0 border-t border-l border-black w-full flex-none mb-4 min-h-0`;
            for(let i=0; i<this.maxPhotos; i++) {
                const cell = document.getElementById(`${this.outPrefix}-cell-${i+1}`); const cap = document.getElementById(`${this.outPrefix}-cap-${i+1}`); const img = document.getElementById(`${this.outPrefix}-img-${i+1}`);
                if(cell) {
                    if(this.photos[i]) { cell.style.display = 'flex'; cell.className = "border-r border-b border-black flex flex-col p-1 h-[60mm]"; if(img) { img.className = "w-full h-full object-cover hidden"; img.classList.remove('hidden'); } if(cap) cap.style.display = 'block'; } 
                    else { cell.style.display = 'none'; }
                }
            }
        }
    }
    
    render() {
        if(!this.gridContainer) return;
        this.gridContainer.innerHTML = '';
        for(let i=0; i<this.maxPhotos; i++) {
            const hasPhoto = !!this.photos[i];
            const box = document.createElement('div'); box.className = 'bg-white p-2 border border-red-100 rounded shadow-sm flex flex-col eviden-grid-box';
            const title = document.createElement('span'); title.className = 'text-xs font-bold text-red-600 mb-1 flex justify-between px-1'; title.innerHTML = `<span>Foto ${i+1}</span> <span class="text-red-300 font-normal">#${i+1}</span>`; box.appendChild(title);
            const imgContainer = document.createElement('div'); imgContainer.className = 'w-full h-32 bg-red-50 flex items-center justify-center border border-red-200 rounded overflow-hidden mb-2 relative group eviden-img-wrapper cursor-pointer';
            
            if(hasPhoto) {
                const img = document.createElement('img'); img.src = this.photos[i]; img.className = 'w-full h-full object-cover'; imgContainer.appendChild(img);
                const overlay = document.createElement('div'); overlay.className = 'absolute inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity';
                const btnReplace = document.createElement('button'); btnReplace.type = 'button'; btnReplace.innerHTML = '🔄 Ganti'; btnReplace.className = 'bg-white text-red-600 border border-red-500 text-[10px] font-bold px-2 py-1 rounded hover:bg-red-50 shadow cursor-pointer z-10'; btnReplace.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.triggerReplace(i); };
                const btnDelete = document.createElement('button'); btnDelete.type = 'button'; btnDelete.innerHTML = '🗑️ Hapus'; btnDelete.className = 'bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-red-700 shadow cursor-pointer z-10'; btnDelete.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.removePhoto(i); };
                overlay.appendChild(btnReplace); overlay.appendChild(btnDelete); imgContainer.appendChild(overlay);
            } else {
                const span = document.createElement('span'); span.className = 'text-red-300 text-[10px] text-center px-2 pointer-events-none font-medium'; span.innerText = '(Klik untuk isi)'; imgContainer.appendChild(span); imgContainer.onclick = () => this.triggerReplace(i);
            }
            box.appendChild(imgContainer);
            if(this.defaultCaptions.length > 0) {
                const capInput = document.createElement('input'); capInput.type = 'text'; capInput.className = 'w-full border border-red-200 text-red-800 p-1 rounded text-xs text-center font-bold uppercase mt-auto outline-none focus:ring-1 focus:ring-red-500'; capInput.value = this.captions[i] || ''; capInput.oninput = (e) => this.updateCaption(i, e.target.value); box.appendChild(capInput);
            }
            this.gridContainer.appendChild(box);
        }
    }
}

// ============================================
// LOGIKA EDITOR EKSTRA
// ============================================
function simpanEditorEkstra() {
    const editor = document.getElementById('lembar-kerja');
    if (editor) {
        localStorage.setItem('bautPro_editor_ekstra', editor.innerHTML);
        showCustomToast("Mantap! Laporan Ekstra berhasil disimpan ke draf lokal.", false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateDynamicPreviewPages();
    injectFormActions(); 
    renderDynamicNav(); 

    updateReport();
    setGlobalLogos();

    const applyGlobalTtdTif = (ev) => { document.querySelectorAll('.img-ttd-kiri').forEach(img => { img.src = ev.target.result; img.classList.remove('hidden'); }); document.querySelectorAll('.txt-ttd-kiri').forEach(txt => txt.style.display = 'none'); };
    const applyGlobalTtdTa = (ev) => { document.querySelectorAll('.img-ttd-kanan').forEach(img => { img.src = ev.target.result; img.classList.remove('hidden'); }); document.querySelectorAll('.txt-ttd-kanan').forEach(txt => txt.style.display = 'none'); };

    if(document.getElementById('inp-ttd-tif')) document.getElementById('inp-ttd-tif').addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = applyGlobalTtdTif; r.readAsDataURL(e.target.files[0]); } });
    if(document.getElementById('inp-ttd-ta')) document.getElementById('inp-ttd-ta').addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = applyGlobalTtdTa; r.readAsDataURL(e.target.files[0]); } });

    if(document.getElementById('inp-paraf-tif')) document.getElementById('inp-paraf-tif').addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => { window.globalParafTif = ev.target.result; applyGlobalParaf(); }; r.readAsDataURL(e.target.files[0]); } });
    if(document.getElementById('inp-paraf-ta')) document.getElementById('inp-paraf-ta').addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => { window.globalParafTa = ev.target.result; applyGlobalParaf(); }; r.readAsDataURL(e.target.files[0]); } });
    
    if(document.getElementById('inp-logo-kiri')) document.getElementById('inp-logo-kiri').addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => { document.querySelectorAll('.out-logo-kiri').forEach(img => img.src = ev.target.result); }; r.readAsDataURL(e.target.files[0]); } });
    if(document.getElementById('inp-logo-kanan')) document.getElementById('inp-logo-kanan').addEventListener('change', (e) => { if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => { document.querySelectorAll('.out-logo-kanan').forEach(img => img.src = ev.target.result); }; r.readAsDataURL(e.target.files[0]); } });

    setupImageUpload('inp-img-tkp-rekap', 'out-tkp-img-rekap'); setupImageUpload('inp-img-tkp-material', 'out-tkp-img-material'); setupImageUpload('inp-img-boq', 'out-boq-tabel-img');
    [7,8,9,10,11].forEach(i => setupImageUpload(`inp-img-opm${i}`, `out-opm${i}-tabel-img`));
    [22,23,24,25,26].forEach(i => setupImageUpload(`inp-img-otdr${i}-full`, `out-otdr${i}-img-full`));
    setupImageUpload('inp-img-abd-table', 'out-abd-img-table'); setupImageUpload('inp-ttd-abd-kiri', 'out-abd-img-ttd1', 'txt-ttd-kiri-abd');
    setupImageUpload('inp-img-kml', 'out-kml-img-table'); setupImageUpload('inp-img-mancore', 'out-mancore-img-table');

    window.ev1Uploader = new PhotoUploader('ev1', 9, 'out-ev1', ["Foto 1", "Foto 2", "Foto 3", "Foto 4", "Foto 5", "Foto 6", "Foto 7", "Foto 8", "Foto 9"]); 
    
    const patterns = [
        { uploaderId: 'ev2', capId: 'out-ev2', odpName: "85", isLanjutan: false, max: 9 },
        { uploaderId: 'ev3', capId: 'out-ev3', odpName: "85", isLanjutan: true, max: 2 },
        { uploaderId: 'ev4', capId: 'out-ev4', odpName: "86", isLanjutan: false, max: 9 },
        { uploaderId: 'ev5', capId: 'out-ev5', odpName: "86", isLanjutan: true, max: 2 },
        { uploaderId: 'ev6', capId: 'out-ev6', odpName: "87", isLanjutan: false, max: 9 },
        { uploaderId: 'ev7', capId: 'out-ev7', odpName: "87", isLanjutan: true, max: 2 },
        { uploaderId: 'ev8', capId: 'out-ev8', odpName: "88", isLanjutan: false, max: 9 },
        { uploaderId: 'ev9', capId: 'out-ev9', odpName: "88", isLanjutan: true, max: 2 },
        { uploaderId: 'ev10', capId: 'out-ev10', odpName: "89", isLanjutan: false, max: 9 },
        { uploaderId: 'ev11', capId: 'out-ev11', odpName: "89", isLanjutan: true, max: 2 }
    ];

    patterns.forEach(p => {
        let defaults = !p.isLanjutan ? ["P-IN OUT SPL-1.04 ODC", `ODP FAE ${p.odpName}`, "AKSESORIS ODP", "PORT 1", "PORT 2", "PORT 3", "PORT 4", "PORT 5", "PORT 6"] : ["PORT 7", "PORT 8"];
        window[`${p.uploaderId}Uploader`] = new PhotoUploader(p.uploaderId, p.max, p.capId, defaults);
        defaults.forEach((cap, idx) => { const outCap = document.getElementById(`${p.capId}-cap-${idx+1}`); if(outCap) outCap.innerText = cap; });
    });

    // Jalankan pemuatan draf Editor Ekstra
    setTimeout(() => {
        const savedEditor = localStorage.getItem('bautPro_editor_ekstra');
        const editor = document.getElementById('lembar-kerja');
        if (savedEditor && editor) {
            editor.innerHTML = savedEditor;
        }
    }, 600);
});

function cetakPDF() {
    switchTab('report-tab');
    document.querySelectorAll('[id^="preview-page-"]').forEach(pageEl => {
        pageEl.classList.remove('hidden');
        pageEl.style.display = 'block';
    });
    document.querySelectorAll('#preview-nav-container button').forEach(btn => {
        if(btn.id && btn.id.startsWith('btn-prev-')) btn.className = "flex-shrink-0 px-3 py-2 bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded font-bold transition text-xs sm:text-sm shadow-sm";
    });
    setTimeout(() => { window.print(); }, 1000);
}

// ============================================
// FITUR AUTO-SAVE (LOCAL STORAGE)
// ============================================
function initAutoSave() {
    const inputs = document.querySelectorAll('input:not([type="file"]), textarea, select');
    
    // 1. Muat data yang tersimpan saat aplikasi dibuka
    inputs.forEach(el => {
        if (el.id) {
            const savedValue = localStorage.getItem('bautPro_' + el.id);
            if (savedValue !== null) {
                el.value = savedValue;
            }
        }
    });

    // 2. Simpan data secara otomatis setiap kali ada ketikan/perubahan
    inputs.forEach(el => {
        el.addEventListener('input', () => {
            if (el.id) {
                localStorage.setItem('bautPro_' + el.id, el.value);
            }
        });
        el.addEventListener('change', () => {
            if (el.id) {
                localStorage.setItem('bautPro_' + el.id, el.value);
            }
        });
    });

    // 3. Tambahkan tombol Reset Data di Sidebar
    const sidebarNav = document.querySelector('aside nav');
    if (sidebarNav && !document.getElementById('btn-reset-data')) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'btn-reset-data';
        resetBtn.type = 'button';
        resetBtn.className = "w-full text-left px-4 py-3 mt-4 rounded bg-red-100 text-red-800 border border-red-300 font-bold hover:bg-red-200 transition shadow-sm";
        resetBtn.innerHTML = "🗑️ Hapus Semua Data Auto-Save";
        resetBtn.onclick = () => {
            if (confirm("Yakin ingin mereset seluruh isian form? Data yang belum dicetak akan hilang.")) {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('bautPro_')) localStorage.removeItem(key);
                });
                location.reload();
            }
        };
        sidebarNav.appendChild(resetBtn);
    }
}

// Jalankan auto-save setelah seluruh DOM siap
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAutoSave, 500);
});
