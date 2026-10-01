/* Greenline Landscapes: header, mobile menu, services accordion, cost estimator and form validation */
(function(){
  /* Header: solid after scrolling past the top of the hero */
  var header=document.querySelector('header.top');
  function onScroll(){header.classList.toggle('solid',window.scrollY>40);}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  /* Mobile menu */
  var t=document.querySelector('.nav-toggle'),n=document.getElementById('site-nav');
  function setNav(o){n.classList.toggle('open',o);header.classList.toggle('menu-open',o);t.setAttribute('aria-expanded',o?'true':'false');t.setAttribute('aria-label',o?'Close menu':'Open menu');}
  t.addEventListener('click',function(){setNav(!n.classList.contains('open'));});
  n.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setNav(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&n.classList.contains('open')){setNav(false);t.focus();}});

  /* Services accordion with linked image */
  var items=[].slice.call(document.querySelectorAll('.svc')),img=document.getElementById('svc-img'),cap=document.getElementById('svc-cap');
  function activate(li){
    items.forEach(function(x){var on=x===li;x.classList.toggle('active',on);x.querySelector('button').setAttribute('aria-expanded',on?'true':'false');});
    if(img.getAttribute('src')!==li.dataset.img){img.style.opacity=0;setTimeout(function(){img.src=li.dataset.img;img.onload=function(){img.style.opacity=1;};},180);}
    cap.innerHTML=li.dataset.cap;
  }
  items.forEach(function(li){
    var b=li.querySelector('button');
    b.addEventListener('click',function(){activate(li);});
    li.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover) and (min-width:901px)').matches)activate(li);});
  });

  /* Cost estimator (example rates per unit, plus a fixed setup cost) */
  var rates={
    patio:{std:110,prem:170,base:600,unit:'m²',label:'Area (square metres)',min:5,max:120,step:5,val:30,note:{std:'Sandstone or concrete paving on a full sub-base.',prem:'Porcelain or natural stone, with edging and drainage.'}},
    lawn:{std:14,prem:24,base:250,unit:'m²',label:'Area (square metres)',min:10,max:300,step:10,val:80,note:{std:'Ground levelled and prepared, quality turf laid.',prem:'Imported topsoil, premium turf and steel edging.'}},
    planting:{std:55,prem:90,base:200,unit:'m²',label:'Bed area (square metres)',min:2,max:60,step:2,val:12,note:{std:'Soil improvement, mixed shrubs and perennials.',prem:'Larger specimen plants, mulch and a planting plan.'}},
    fence:{std:85,prem:140,base:150,unit:'m',label:'Length (metres)',min:4,max:60,step:2,val:20,note:{std:'Treated timber panels with concrete posts.',prem:'Slatted hardwood or composite screening.'}}
  };
  var size=document.getElementById('size'),out=document.getElementById('size-out'),lbl=document.getElementById('size-lbl'),price=document.getElementById('est-price'),note=document.getElementById('est-note');
  function job(){return document.querySelector('input[name=job]:checked').value;}
  function fin(){return document.querySelector('input[name=finish]:checked').value;}
  function fmt(x){return '£'+(Math.round(x/50)*50).toLocaleString('en-GB');}
  function calc(){
    var r=rates[job()],f=fin(),q=Number(size.value),mid=r.base+r[f]*q;
    out.textContent=q+' '+r.unit;
    price.textContent=fmt(mid*0.88)+' – '+fmt(mid*1.18);
    note.textContent=r.note[f];
  }
  document.querySelectorAll('input[name=job]').forEach(function(i){i.addEventListener('change',function(){var r=rates[job()];size.min=r.min;size.max=r.max;size.step=r.step;size.value=r.val;lbl.textContent=r.label;calc();});});
  document.querySelectorAll('input[name=finish]').forEach(function(i){i.addEventListener('change',calc);});
  size.addEventListener('input',calc);
  calc();

  /* Form validation */
  document.querySelectorAll('form.enquiry').forEach(function(form){
    var summary=document.createElement('div');summary.className='err-summary';summary.setAttribute('role','alert');summary.tabIndex=-1;summary.hidden=true;form.insertBefore(summary,form.firstChild);
    var fields=form.querySelectorAll('[required]');
    function labelFor(f){var l=form.querySelector('label[for="'+f.id+'"]');return l?l.childNodes[0].textContent.trim().toLowerCase():'this field';}
    function check(f){
      var err=document.getElementById(f.id+'-err');
      if(!err){err=document.createElement('p');err.id=f.id+'-err';err.className='field-err';f.insertAdjacentElement('afterend',err);}
      var v=f.validity,m='';
      if(v.valueMissing)m='Enter your '+labelFor(f);else if(v.typeMismatch)m='Enter a valid '+labelFor(f);
      err.textContent=m;err.hidden=!m;
      if(m){f.setAttribute('aria-invalid','true');f.setAttribute('aria-describedby',err.id);}else{f.removeAttribute('aria-invalid');f.removeAttribute('aria-describedby');}
      return m;
    }
    fields.forEach(function(f){f.addEventListener('blur',function(){if(f.value||f.getAttribute('aria-invalid'))check(f);});f.addEventListener('input',function(){if(f.getAttribute('aria-invalid'))check(f);});});
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var problems=[];fields.forEach(function(f){var m=check(f);if(m)problems.push([f,m]);});
      if(problems.length){
        summary.innerHTML='';var h=document.createElement('p');h.className='err-title';h.textContent='There is a problem';summary.appendChild(h);
        var ul=document.createElement('ul');problems.forEach(function(p){var li=document.createElement('li');var a=document.createElement('a');a.href='#'+p[0].id;a.textContent=p[1];a.addEventListener('click',function(ev){ev.preventDefault();p[0].focus();});li.appendChild(a);ul.appendChild(li);});
        summary.appendChild(ul);summary.hidden=false;summary.focus();return;
      }
      var ok=document.createElement('div');ok.className='form-ok';ok.setAttribute('role','status');ok.tabIndex=-1;
      ok.innerHTML='<p class="ok-title">Thank you.</p><p>We’ll be in touch within two working days to arrange your free site visit. This is a sample site, so nothing was actually sent.</p>';
      form.replaceWith(ok);ok.focus();
    });
  });
})();
