const WORKS1 = [
    {
        image:        './img/artworks/artwork-1-desktop.png',
        image_mobile: './img/artworks/artwork-1-mobile.png',
        video:        './img/artworks/artwork-1-video.mp4',
        date:     "oct '24",
        index:    'INDEX.01',
        cat_key:  'cat-circus',
        title_nl: 'Circuspinball',
        title_en: 'Circuspinball',
        desc_nl:  'Een looping animatie waarbij een bal transformeert in een metalen bal en door een grillige, droomachtige circuswereld reist.',
        desc_en:  'Looping Pinball Circus - A looping animation where a ball transforms into a metal ball and is taken trough a whimsical dream-like circus world.',
        tag1_nl:  'Looping Animatie',
        tag1_en:  'Looping Animation',
        tag2:     '3D Animation',
        tag3_nl:  'Circus',
        tag3_en:  'Circus',
    },
    {
        image:        './img/artworks/artwork-2-desktop.png',
        image_mobile: './img/artworks/artwork-2-mobile.png',
        video:        './img/artworks/artwork-2-video.mp4',
        date:     "oct '24",
        index:    'INDEX.02',
        cat_key:  'cat-environment',
        title_nl: 'Italiaans Dorp',
        title_en: 'Italian Village',
        desc_nl:  'Een procedureel systeem genereert deze huizen en worden daarna van texturen voorzien. Met ook een klokkentoren.',
        desc_en:  'Italian Village Environment - A procedural system generates these houses and are textured afterwards. Also featuring a belltower.',
        tag1_nl:  'Omgeving',
        tag1_en:  'Environment',
        tag2:     '3D Render',
        tag3_nl:  'Procedureel',
        tag3_en:  'Procedural',
    },
    {
        image:        './img/artworks/artwork-3-desktop.png',
        image_mobile: './img/artworks/artwork-3-mobile.png',
        video:        './img/artworks/artwork-3-video.mp4',
        date:     "oct '24",
        index:    'INDEX.03',
        cat_key:  'cat-rocket',
        title_nl: 'Ontvouwende Raket',
        title_en: 'Unfolding Rocket',
        desc_nl:  'Een looping 3D-animatie van een raket die ontvouwt in verschillende delen. Gemaakt voor een stageproject.',
        desc_en:  'Unfolding Rocket - A looping 3D Animation of a rocket unfolding in different parts. Made for an internship project.',
        tag1_nl:  'Looping Animatie',
        tag1_en:  'Looping Animation',
        tag2:     '3D Animation',
        tag3_nl:  'Stage',
        tag3_en:  'Internship',
    },
];

const WORKS2 = [
    {
        image:    './img/featured-works/work-3.webp',
        date:     "oct '24",
        index:    'INDEX.01',
        cat_key:  'cat-recovery',
        title_nl: 'Bosscène',
        title_en: 'Forest Scene',
        desc_nl:  'Een persoonlijk omgevingsstuk dat dichte jungleatmosferen en volumetrische belichting verkent.',
        desc_en:  'A personal environment piece exploring dense jungle atmospheres and volumetric lighting.',
        tag1_nl:  'Omgeving',
        tag1_en:  'Environment',
        tag2:     '3D Render',
        tag3_nl:  'Sfeervol',
        tag3_en:  'Atmospheric',
    },
    {
        image:    './img/featured-works/work-2.webp',
        date:     "oct '24",
        index:    'INDEX.02',
        cat_key:  'cat-mystic',
        title_nl: 'Mystieke Tuin',
        title_en: 'Mystic Garden',
        desc_nl:  'Een persoonlijk omgevingsstuk dat dichte jungleatmosferen en volumetrische belichting verkent.',
        desc_en:  'A personal environment piece exploring dense jungle atmospheres and volumetric lighting.',
        tag1_nl:  'Natuur',
        tag1_en:  'Nature',
        tag2:     '3D Render',
        tag3_nl:  'Cinematisch',
        tag3_en:  'Cinematic',
    },
    {
        image:    './img/featured-works/work-4.webp',
        date:     "oct '24",
        index:    'INDEX.03',
        cat_key:  'cat-ancient',
        title_nl: 'Oud Pad',
        title_en: 'Ancient Path',
        desc_nl:  'Een persoonlijk omgevingsstuk dat dichte jungleatmosferen en volumetrische belichting verkent.',
        desc_en:  'A personal environment piece exploring dense jungle atmospheres and volumetric lighting.',
        tag1_nl:  'Architectuur',
        tag1_en:  'Architecture',
        tag2:     '3D Render',
        tag3_nl:  'Sfeervol',
        tag3_en:  'Moody',
    },
];

function buildTrackHTML(worksArray, lang, translations) {
    const t = translations[lang];
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    return worksArray.map((w, i) => {
        const title   = lang === 'nl' ? w.title_nl : w.title_en;
        const desc    = lang === 'nl' ? w.desc_nl  : w.desc_en;
        const tag1    = lang === 'nl' ? w.tag1_nl  : w.tag1_en;
        const tag3    = lang === 'nl' ? w.tag3_nl  : w.tag3_en;
        const catText = t[w.cat_key] || w.cat_key;

        const hasVideo = !!w.video;
        const poster   = (isMobile && w.image_mobile) ? w.image_mobile : w.image;

        // video ունեցող items-ը background-image չունեն - video-ն ցուցադրվում է
        const bgStyle = hasVideo ? '' : `style="background-image: url(${w.image});"`;

        const videoHTML = hasVideo ? `
            <video
                class="work-item-video"
                data-src="${w.video}"
                poster="${poster}"
                muted
                loop
                playsinline
                preload="none"
            ></video>` : '';

        const progressHTML = hasVideo ? `
            <div class="work-item-progress-wrap">
                <div class="work-item-progress">
                    <div class="work-item-progress-fill"></div>
                    <div class="work-item-progress-thumb"></div>
                    <div class="work-item-progress-hit"></div>
                </div>
            </div>` : '';

        // top-info-ն թաքցնում ենք video ունեցող items-ի համար
        const topInfoHTML = hasVideo ? '' : `
            <div class="work-item-top-info">
                <h3 class="work-item-top-info-category">${w.index} <span>${catText}</span></h3>
                <h3 class="work-item-top-info-data">${w.date}</h3>
            </div>`;

        return `<div class="featured-work-item${hasVideo ? ' has-video' : ''}" ${bgStyle} data-work-id="${i + 1}" data-overlay-title="${title}" data-overlay-desc="${desc}">
    <img class="work-item-seo-img" src="${poster}" alt="${title} – 3D render by Tumbling Totem" aria-hidden="true" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;">
    ${videoHTML}
    <div class="work-item-top-shadow"></div>
    ${topInfoHTML}
    ${progressHTML}
    <div class="work-item-bottom-info">
        <h2 class="work-item-bottom-info-title">${title}</h2>
        <div class="work-item-bottom-info-tags">
            <p>${tag1}</p>
            <div class="tag-divider-circle"></div>
            <p>${w.tag2}</p>
            <div class="tag-divider-circle"></div>
            <p>${tag3}</p>
        </div>
    </div>
    <div class="work-item-bottom-shadow"></div>
</div>`;
    }).join('\n');
}
