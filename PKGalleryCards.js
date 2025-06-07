class PKGalleryCards {
  static instanceCounter = 0;

  constructor(options) {
    this.selector = options.selector || '#pk-gallery-cards';
    this.title = options.title || 'Gallery';
    this.items = options.items || [];
    this.pageSize = options.itemsPerPage || 3;
    this.autoSlideMs = options.autoSlideMs !== undefined ? options.autoSlideMs : 5000;

    this.instanceId = 'pk-carousel-' + (++PKGalleryCards.instanceCounter);
    this.pageId = 'pk-gallery-page-' + PKGalleryCards.instanceCounter;

    this.render();
    this.bindEvents();
  }

  render() {
    const pageCount = Math.ceil(this.items.length / this.pageSize);
    const carouselOptions = this.autoSlideMs === -1 ? 'false' : this.autoSlideMs;

    let html = `
      <section class="resources-section py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5">${this.title}</h2>
          <div id="${this.instanceId}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="${carouselOptions}">
            <div class="carousel-inner">`;

    for (let i = 0; i < pageCount; i++) {
      html += `<div class="carousel-item ${i === 0 ? 'active' : ''}">
        <div class="row g-4">`;

      for (let j = 0; j < this.pageSize; j++) {
        const item = this.items[i * this.pageSize + j];
        if (!item) continue;

        const imgClass = item.displayFullImage ? 'card-img-top full-image' : 'card-img-top cover-image';
        const linkStart = item.url ? `<a href="${item.url}" target="_blank">` : '';
        const linkEnd = item.url ? `</a>` : '';

        html += `
          <div class="col-md-${Math.floor(12 / this.pageSize)}">
            <div class="card PKGalleryCards_card h-100">
              <div class="position-relative">
                ${linkStart}
                <img src="${item.img}" class="${imgClass}" alt="${item.title}">
                ${linkEnd}
                <span class="badge position-absolute top-0 start-0 m-3 bg-white text-dark">${item.title}</span>
              </div>
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
            </div>
          </div>`;
      }

      html += `</div></div>`;
    }

    html += `
        </div>
        <div class="text-center mt-4">
          <div class="d-flex justify-content-center align-items-center gap-3">
            <button class="btn btn-outline-primary rounded-circle" type="button"
                    data-bs-target="#${this.instanceId}" data-bs-slide="prev">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span id="${this.pageId}" class="pk-page-indicator">1 / ${pageCount}</span>
            <button class="btn btn-primary rounded-circle" type="button"
                    data-bs-target="#${this.instanceId}" data-bs-slide="next">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>`;

    $(this.selector).html(html);
    this.pageCount = pageCount;
  }

  bindEvents() {
    const self = this;
    $('#' + this.instanceId).on('slid.bs.carousel', function (e) {
      const index = $(e.relatedTarget).index();
      $('#' + self.pageId).text((index + 1) + ' / ' + self.pageCount);
    });
  }
}
