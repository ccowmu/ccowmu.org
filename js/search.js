(function(){
  const searchInput = document.getElementById('search');
  const yearFilter = document.getElementById('year-filter');
  const list = document.getElementById('minutes-list');
  const resultCount = document.getElementById('result-count');
  if(!searchInput || !list) return;

  fetch('/minutes/index.json')
    .then(r=>r.json())
    .then(data=>{
      const index = new FlexSearch.Document({
        tokenize: 'forward',
        document:{
          id:'slug',
          index:['title','content']
        }
      });
      data.forEach(d=>index.add(d));
      const entries = data;

      function render(results){
        const year = yearFilter.value;
        let items = entries;
        if(results) items = entries.filter(e=>results.includes(e.slug));
        if(year !== 'all') items = items.filter(e=>e.date.startsWith(year));
        list.innerHTML = items.map(e=>`<li data-year="${e.date.substring(0,4)}"><a href='/minutes/${e.slug}/'>${e.title}</a></li>`).join('');
        resultCount.textContent = `Showing ${items.length} of ${entries.length} results`;
      }

      searchInput.addEventListener('input', ()=>{
        const q = searchInput.value.trim();
        if(q){
          const res = index.search(q, { enrich: true });
          const ids = [...new Set(res.flatMap(r=>r.result))];
          render(ids);
        } else {
          render();
        }
      });

      yearFilter.addEventListener('change', ()=>{
        const q = searchInput.value.trim();
        if(q){
          const res = index.search(q, { enrich: true });
          const ids = [...new Set(res.flatMap(r=>r.result))];
          render(ids);
        } else {
          render();
        }
      });

      render();
    });
})();
