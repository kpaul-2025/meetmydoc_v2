/* =========================
   main.js - cleaned & consolidated
   (Replace your current js/main.js with this)
   ========================= */

(function ($) {
  "use strict";

  /* ---------- Helpers ---------- */
  function hideSpinner() {
    try {
      var p = document.getElementById('preloader');
      if (p) { p.classList.add('fade-out'); setTimeout(function(){ p.style.display='none'; }, 350); }
      var s = document.getElementById('spinner');
      if (s) s.classList.remove('show');
    } catch (e) { console.error(e); }
  }

  function cleanupModalBackdrops() {
    try {
      document.querySelectorAll('.modal-backdrop').forEach(function (b) { b.remove(); });
      $('body').removeClass('modal-open').css('padding-right', '');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    } catch (e) { console.error('cleanupModalBackdrops', e); }
  }

  /* ---------- Core init ---------- */
  $(function () {
    // quick spinner hide
    setTimeout(hideSpinner, 10);

    // init wow (if present)
    if (window.WOW) { try { new WOW().init(); } catch(e){} }

    // sticky navbar
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 300) $('.sticky-top').addClass('shadow-sm').css('top','0px');
      else $('.sticky-top').removeClass('shadow-sm').css('top','-100px');
    });

    // back-to-top
    $(window).on('scroll', function () { if ($(this).scrollTop() > 300) $('.back-to-top').fadeIn('slow'); else $('.back-to-top').fadeOut('slow'); });
    $('.back-to-top').on('click', function(){ $('html,body').animate({scrollTop:0},1200,'easeInOutExpo'); return false; });

    // optional libs safe init
    if ($.fn.counterUp) $('[data-toggle="counter-up"]').counterUp({ delay: 10, time: 2000 });
    if ($.fn.datetimepicker) { $('.date').datetimepicker({ format:'L' }); $('.time').datetimepicker({ format:'LT' }); }
    if ($.fn.owlCarousel) {
      $(".header-carousel").owlCarousel({ autoplay:false, animateOut:'fadeOutLeft', items:1, dots:true, loop:true, nav:true, navText:['<i class="bi bi-chevron-left"></i>','<i class="bi bi-chevron-right"></i>'] });
      $(".testimonial-carousel").owlCarousel({ autoplay:false, smartSpeed:1000, center:true, dots:false, loop:true, nav:true, responsive:{0:{items:1},768:{items:2}} });
    }
  });

  /* ---------- Doctors page rendering & modal ---------- */
  (function () {
    var $grid = $('#doctorsGrid');
    if ($grid.length === 0) return; // not on doctors page

    // small local dataset (replace with ajax if needed)
    var doctorsData = [
      {id:1,name:'Dr. Anjali Bose',spec:'Neurology',exp:13,avail:'Tue,Thu 10:00-17:00',fee:'₹800',img:'img/carousel-1.jpg',address:'NeuroCare Center',contact:'+91-9876500008',email:'anjali.bose@example.com'},
      {id:2,name:'Dr. Arvind Mehra',spec:'Neurology',exp:14,avail:'Mon–Fri 09:00-15:00',fee:'₹700',img:'img/team-2.jpg',address:'City Neuro Clinic',contact:'+91-9876500002',email:'arvind.mehra@example.com'},
      {id:3,name:'Dr. Drishti Rao',spec:'Gynecology',exp:8,avail:'Mon,Wed 10:00-15:00',fee:'₹650',img:'img/team-3.jpg',address:'Women Health Clinic',contact:'+91-9876500006',email:'drishti.rao@example.com'},
      {id:4,name:'Dr. Karan Mallick',spec:'Dental Surgeon',exp:9,avail:'Tue–Sat 10:00-14:00',fee:'₹400',img:'img/team-4.jpg',address:'Smile Dental Clinic',contact:'+91-9876500004',email:'karan.mallick@example.com'},
      {id:5,name:'Dr. Karan Mehta',spec:'General Medicine',exp:9,avail:'Daily 08:00-20:00',fee:'₹300',img:'img/feature.jpg',address:'City Clinic',contact:'+91-9876500007',email:'karan.mehta@example.com'},
      {id:6,name:'Dr. Meera Iyer',spec:'Ophthalmology',exp:7,avail:'Wed,Fri 09:00-15:00',fee:'₹500',img:'img/carousel-3.jpg',address:'EyeCare Hospital',contact:'+91-9876500010',email:'meera.iyer@example.com'},
      {id:7,name:'Dr. Nisha Verma',spec:'Cardiology',exp:12,avail:'Tue–Sat 10:00-16:00',fee:'₹600',img:'img/team-1.jpg',address:'Agartala Medical Center',contact:'+91-9876500001',email:'nisha.verma@example.com'},
      {id:8,name:'Dr. Priya Saha',spec:'Orthopedics',exp:10,avail:'Mon,Wed,Fri 11:00-18:00',fee:'₹550',img:'img/carousel-2.jpg',address:'OrthoCare Hospital',contact:'+91-9876500003',email:'priya.saha@example.com'}
    ];

    // render grid
    function renderGrid() {
      $grid.empty();
      doctorsData.forEach(function (d) {
        var html = ''
          + '<div class="col-lg-3 col-md-6">'
          + '  <div class="team-item doctor-card position-relative rounded overflow-visible"'
          +     ' data-id="'+d.id+'" data-name="'+escapeHtml(d.name)+'" data-spec="'+escapeHtml(d.spec)+'" data-exp="'+d.exp+'"'
          +     ' data-avail="'+escapeHtml(d.avail)+'" data-fee="'+escapeHtml(d.fee)+'" data-address="'+escapeHtml(d.address)+'"'
          +     ' data-contact="'+escapeHtml(d.contact)+'" data-email="'+escapeHtml(d.email)+'" data-img="'+escapeHtml(d.img)+'">'
          + '    <div class="overflow-hidden">'
          + '      <img class="img-fluid" src="'+d.img+'" alt="'+escapeHtml(d.name)+'" onerror="this.onerror=null;this.src=\'img/placeholder.png\'">'
          + '    </div>'
          + '    <div class="team-text bg-light text-center p-4">'
          + '      <h5 class="card-title">'+escapeHtml(d.name)+'</h5>'
          + '      <p class="text-primary card-spec">'+escapeHtml(d.spec)+'</p>'
          + '      <div class="card-meta">'
          + '        <p class="text-muted mb-2">Experience: '+d.exp+' yrs</p>'
          + '        <p class="text-primary">🗓️ '+escapeHtml(d.avail)+' • Fee: '+escapeHtml(d.fee)+'</p>'
          + '      </div>'
          + '      <div class="card-actions mt-3 d-flex justify-content-center gap-2">'
          + '        <a href="apoinmnet.html?doctor_id='+d.id+'" class="btn btn-primary btn-sm">Book</a>'
          + '        <button type="button" class="btn btn-outline-secondary btn-sm btn-doctor-details">Details</button>'
          + '      </div>'
          + '    </div>'
          + '  </div>'
          + '</div>';
        $grid.append(html);
      });

      // bind details
      $grid.find('.btn-doctor-details').off('click').on('click', function (e) {
        e.preventDefault();
        var card = $(this).closest('.doctor-card');
        if (!card.length) return;
        var data = {
          id: card.data('id'),
          name: card.data('name'),
          spec: card.data('spec'),
          exp: card.data('exp'),
          avail: card.data('avail'),
          fee: card.data('fee'),
          address: card.data('address'),
          contact: card.data('contact'),
          email: card.data('email'),
          img: card.data('img') || (card.find('img').attr('src') || 'img/placeholder.png')
        };
        showModal(data);
      });
    }

    // show bootstrap modal with data
    var bsModal = null;
    function showModal(d) {
      var modalEl = document.getElementById('doctorDetailsModal');
      if (!modalEl) return;
      var $m = $(modalEl);
      $m.find('#modalDoctorImg').attr('src', d.img).off('error').on('error', function(){ $(this).attr('src','img/placeholder.png'); });
      $m.find('#modalDoctorName').text(d.name || '');
      $m.find('#modalDoctorSpec').text((d.spec || '') + (d.fee ? ' • ' + d.fee : ''));
      $m.find('#modalDoctorExp').text(d.exp ? ('Experience: ' + d.exp + ' years') : '');
      $m.find('#modalDoctorAddress').text(d.address ? ('Address: ' + d.address) : '');
      $m.find('#modalDoctorContact').text(((d.contact) ? ('Contact: ' + d.contact) : '') + (d.email ? (' • ' + d.email) : ''));
      $m.find('#modalDoctorAvail').text(d.avail ? ('Availability: ' + d.avail) : '');
      $m.find('#modalDoctorBook').attr('href', 'apoinmnet.html?doctor_id=' + encodeURIComponent(d.id || ''));
      $m.find('#modalDoctorMail').attr('href', 'mailto:' + encodeURIComponent(d.email || ''));

      if (!bsModal) bsModal = new bootstrap.Modal(modalEl, {});
      bsModal.show();
    }

    // escape helper
    function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m]; }); }

    // modal cleanup (robust)
    document.addEventListener('hidden.bs.modal', function (ev) {
      cleanupModalBackdrops();
    }, false);

    // also cleanup when close buttons are clicked (failsafe)
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bs-dismiss="modal"], .modal .btn-close');
      if (!btn) return;
      setTimeout(cleanupModalBackdrops, 220);
    });

    // initial render
    renderGrid();
  })();

})(jQuery);
