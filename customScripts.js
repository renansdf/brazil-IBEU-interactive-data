function scoreHexColor(score, bg = false, fc = false) {
  const thresholds = [
    { t: 0.4, bg: "#f22c00", fc: "#fff" },
    { t: 0.7, bg: "#eff200", fc: "#000" },
    { t: 0.8, bg: "#00b146", fc: "#fff" },
    { t: 0.9, bg: "#3dc7ff", fc: "#000" },
    { t: 1, bg: "#0066ea", fc: "#fff" },
  ];

  let bgColor = "", fontColor = "";
  thresholds.some(values => {
    bgColor = values.bg;
    fontColor = values.fc;
    return score < values.t;
  });

  if (bg) {
    return bgColor;
  }

  if (fc) {
    return fontColor;
  }

  return [bgColor, fontColor];
}

function getMunicipioById(id) {
  const numberId = parseInt(id);
  return municipios.find(municipio => numberId === municipio.id);
}

function getBestAndWorstOfRegion(regionId) {
  const region = municipios.filter(municipio => municipio.iduf === regionId);

  const bestOfRegion = region.shift();
  const worstOfRegion = region.pop();

  return [bestOfRegion, worstOfRegion];
}

function generateListItemHtml(id, name, uf, rank, ibeu, d1, d2, d3, d4, d5) {
  return `<li class="municipio-li" id="${id}"><div class="left">${name}</div><div class="left">${uf}</div><div>${rank}</div><div class="isScore" style="background-color: ${scoreHexColor(ibeu, true)}; color: ${scoreHexColor(ibeu, false, true)}">${ibeu.toFixed(3)}</div><div  class="isScore" style="background-color: ${scoreHexColor(d1, true)}; color: ${scoreHexColor(d1, false, true)}">${d1.toFixed(3)}</div><div  class="isScore" style="background-color: ${scoreHexColor(d2, true)}; color: ${scoreHexColor(d2, false, true)}">${d2.toFixed(3)}</div><div  class="isScore" style="background-color: ${scoreHexColor(d3, true)}; color: ${scoreHexColor(d3, false, true)}">${d3.toFixed(3)}</div><div  class="isScore" style="background-color: ${scoreHexColor(d4, true)}; color: ${scoreHexColor(d4, false, true)}">${d4.toFixed(3)}</div><div  class="isScore" style="background-color: ${scoreHexColor(d5, true)}; color: ${scoreHexColor(d5, false, true)}">${d5.toFixed(3)}</div></li>`;
}

function generateShortListItemHtml(id, name, rank, ibeu) {
  return `<li class="municipio-li" id="${id}"><div class="left">${name}</div><div>${rank}</div><div class="isScore" style="background-color: ${scoreHexColor(ibeu, true)}; color: ${scoreHexColor(ibeu, false, true)}">${ibeu.toFixed(3)}</div>`;
}

function generateListTitle(text) {
  return `<li class="municipio-li list-title"><div class="left">${text}</div></div>`;
}

function generatePinHtml(rank, ibeu, d1, d2, d3, d4, d5) {
  return `<div class="popup-container"><div>Ranking: ${rank}</div><div>IBEU: <span style="background-color: ${scoreHexColor(ibeu, true)}; color: ${scoreHexColor(ibeu, false, true)}">${ibeu.toFixed(3)}<span></div><div>Mobilidade: <span style="background-color: ${scoreHexColor(d1, true)}; color: ${scoreHexColor(d1, false, true)}">${d1.toFixed(3)}</span></div><div>Ambiental: <span style="background-color: ${scoreHexColor(d2, true)}; color: ${scoreHexColor(d2, false, true)}">${d2.toFixed(3)}</span></div><div>Habitacional: <span style="background-color: ${scoreHexColor(d3, true)}; color: ${scoreHexColor(d3, false, true)}">${d3.toFixed(3)}</span></div><div>Serviços: <span style="background-color: ${scoreHexColor(d4, true)}; color: ${scoreHexColor(d4, false, true)}">${d4.toFixed(3)}</span></div><div>Infraestrutura: <span style="background-color: ${scoreHexColor(d5, true)}; color: ${scoreHexColor(d5, false, true)}">${d5.toFixed(3)}</span></div></div>`
}

function sortMunicipiosBy(sortKey) {
  let sortedMunicipios = municipios;
  if (sortKey === "ranking") {
    sortedMunicipios.sort((a, b) => a[sortKey] - b[sortKey]);
  } else {
    sortedMunicipios.sort((a, b) => b[sortKey] - a[sortKey]);
  }
  return sortedMunicipios;
}

function getBestAndWorstOfUf(ufName) {
  const region = municipios.filter(municipio => municipio.uf === ufName);
  const topFive = region.slice(0, 5);
  const worstFive = region.slice(-5);

  return [topFive, worstFive];
}

function generatePagination(array, current) {
  const totalPages = Math.floor(array.length / 15);
  totalPages > 10 ? pages = 10 : pages = totalPages;

  for (let index = 0; index < pages; index++) {
    if (index === current) {
      jQuery('#m-pagination').append(`<div class="pagination-anchor active" data-page="${index}">${index + 1}</div>`);
    } else {
      jQuery('#m-pagination').append(`<div class="pagination-anchor" data-page="${index}">${index + 1}</div>`);
    }
  }

  const pesquisa = jQuery('input[name="search"]').val().toLowerCase();
  const parsedPesquisa = pesquisa.replace(/ /g, '-');

  if (totalPages > 10) {
    if (pesquisa.length > 0) {
      jQuery('#m-pagination').append(`<a class="pagination-anchor" href="${window.location.origin}/resultados-da-pesquisa/?ms=${parsedPesquisa}">...</a>`)
    } else {
      jQuery('#m-pagination').append(`<a class="pagination-anchor" href="${window.location.origin}/resultados-da-pesquisa/?ms=todos">...</a>`)
    }
  }
}

function generateSearchCSV(municipiosList, linkElement, municipioName){
  let csvContent = "data:text/csv;charset=utf-8,Municipio,UF,Ranking,IBEU,Mobilidade,Ambiental,Habitacional,Serviços,Insfraestrutura\r\n";
  
  municipiosList.forEach(function(rowObject) {
    let row = rowObject.name + ',' + rowObject.uf + ',' + rowObject.ranking + ',' + rowObject.ibeu + ',' + rowObject.d1 + ',' + rowObject.d2 + ',' + rowObject.d3 + ',' + rowObject.d4 + ',' + rowObject.d5;
    csvContent += row + "\r\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  linkElement.attr('href', encodedUri);

  let fileName = municipioName + '.csv';
  linkElement.attr('download', fileName);
}

(function ($) {
  $(document).ready(function () {

    // IBEU GLOBAL - MAPA
    $('.map-pin div').click(function () {
      const city = $(this).data('metropole');
      $('.metropole-data').removeClass('active');
      $(city).addClass('active');
      $('#mapa-legenda').css({ 'display': 'flex' });
    });

    // IBEU MUNICIPAL - estado inicial
    if ($('.main-municipio-wrapper').length) {
      for (let index = 0; index < 15; index++) {
        const element = municipios[index];
        const liHtml = generateListItemHtml(element.id, element.name, element.uf, element.ranking, element.ibeu, element.d1, element.d2, element.d3, element.d4, element.d5);
        $('#municipios-view-wrapper').append(liHtml);
      }

      $('text[href="http://simplemaps.com"]').remove();
      $('text[x="195"]').remove();
    }

    // IBEU MUNICIPAL SINGLE - estado inicial
    if ($('.single-municipio-wrapper').length) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const dirtySearch = urlParams.get('ms').toLowerCase();
      const municipioSearch = dirtySearch.replace(/-/g, ' ');
      $('input[name="search"]').val(municipioSearch);

      let municipiosList = [];

      if (municipioSearch === 'todos') {
        municipios.forEach(municipio => {
          const liHtml = generateListItemHtml(municipio.id, municipio.name, municipio.uf, municipio.ranking, municipio.ibeu, municipio.d1, municipio.d2, municipio.d3, municipio.d4, municipio.d5);
          $('#municipios-view-wrapper').append(liHtml);
        });
        municipiosList = municipios;
      } else {
        municipios.forEach(municipio => {
          if (municipio.name.toLowerCase().includes(municipioSearch) || municipio.uf.toLowerCase().includes(municipioSearch)) {
            const liHtml = generateListItemHtml(municipio.id, municipio.name, municipio.uf, municipio.ranking, municipio.ibeu, municipio.d1, municipio.d2, municipio.d3, municipio.d4, municipio.d5);
            $('#municipios-view-wrapper').append(liHtml);
            municipiosList.push(municipio);
        }
        });
      }

      if ($('#municipios-view-wrapper').children().length === 0) {
        $('#municipios-view-wrapper').append(generateListTitle('Nenhum municipio encontrado.'));
      }

      generateSearchCSV(municipiosList, $('#results-download'), municipioSearch);
    }

    // IBEU MUNICIPAL - PESQUISAR MUNICIPIO
    $('#search-municipio').submit(function (e) {
      e.preventDefault();
      //cleanup
      $('#municipios-view-wrapper').empty();
      $('#m-pagination').empty();
      const searchedList = [];

      //setup
      const pesquisa = $('input[name="search"]').val().toLowerCase();

      //make
      municipios.forEach(municipio => {
        if (municipio.name.toLowerCase().includes(pesquisa) || municipio.uf.toLowerCase().includes(pesquisa)) {
          const liHtml = generateListItemHtml(municipio.id, municipio.name, municipio.uf, municipio.ranking, municipio.ibeu, municipio.d1, municipio.d2, municipio.d3, municipio.d4, municipio.d5);
          searchedList.push(liHtml);
        }
      });

      for (let index = 0; index < 15; index++) {
        $('#municipios-view-wrapper').append(searchedList[index]);
      }

      generatePagination(searchedList, 0);
    });

    $('#m-pagination').on('click', 'div.pagination-anchor', function () {
      //cleanup
      $('#municipios-view-wrapper').empty();
      $('#m-pagination').empty();
      const searchedList = [];

      //setup
      const pesquisa = $('input[name="search"]').val().toLowerCase();
      const page = $(this).data('page');
      const arrayIndex = page * 15;
      const arrayEnd = arrayIndex + 15;

      //make
      municipios.forEach(municipio => {
        if (municipio.name.toLowerCase().includes(pesquisa) || municipio.uf.toLowerCase().includes(pesquisa)) {
          const liHtml = generateListItemHtml(municipio.id, municipio.name, municipio.uf, municipio.ranking, municipio.ibeu, municipio.d1, municipio.d2, municipio.d3, municipio.d4, municipio.d5);
          searchedList.push(liHtml);
        }
      });

      for (let index = arrayIndex; index < arrayEnd; index++) {
        $('#municipios-view-wrapper').append(searchedList[index]);
      }

      generatePagination(searchedList, page);
    });

    // IBEU MUNICIPAL - SORT
    $('.sort').click(function () {
      //cleanup
      $('#municipios-view-wrapper').empty();
      $('#m-pagination').empty();
      $('.list-heading div').removeClass('active');
      $('.sort').removeClass('active');
      $(this).addClass('active');

      //setup
      const sortBy = $(this).data('sortby');
      const pesquisa = $('input[name="search"]').val().toLowerCase();
      const sortedMunicipios = sortMunicipiosBy(sortBy);
      const sortedList = [];

      //create
      $(`#s-${sortBy}`).addClass('active');

      sortedMunicipios.forEach(municipio => {
        if (municipio.name.toLowerCase().includes(pesquisa) || municipio.uf.toLowerCase().includes(pesquisa)) {
          const liHtml = generateListItemHtml(municipio.id, municipio.name, municipio.uf, municipio.ranking, municipio.ibeu, municipio.d1, municipio.d2, municipio.d3, municipio.d4, municipio.d5);
          sortedList.push(liHtml);
        }
      });

      if ($('.single-municipio-wrapper').length) {
        for (let index = 0; index < sortedList.length; index++) {
          $('#municipios-view-wrapper').append(sortedList[index]);
        }
      } else {
        for (let index = 0; index < 15; index++) {
          $('#municipios-view-wrapper').append(sortedList[index]);
        }

        generatePagination(sortedList, 0);
      }

    });

    $('#map_outer').click(function () {
      $(this).removeClass('active');
    });

    // IBEU MUNICIPAL - CLICAR ESTADO
    simplemaps_countrymap.hooks.zoomable_click_state = async function (id) {
      //cleanup
      $('#municipios-map-wrapper').empty();
      sortMunicipiosBy("ranking");
      $('#map-initial-interface').addClass('hide');
      $('#map-ranking-interface').addClass('active');

      //setup
      const state = simplemaps_countrymap_mapdata.state_specific[id];
      const [topFive, worstFive] = getBestAndWorstOfUf(state.name);
      $('#state-name').text(state.name);
      $('#map_outer').addClass('active');
      const parsedPesquisa = state.name.replace(/ /g, '-');
      const stateUrl = `${window.location.origin}/resultados-da-pesquisa/?ms=${parsedPesquisa}`;
      let allPins = {};

      //populate
      $('#municipios-map-wrapper').append(generateListTitle('Municipios com IBEU mais alto da UF'));
      topFive.forEach(element => {
        const elementHtml = generateShortListItemHtml(element.id, element.name, element.ranking, element.ibeu);
        $('#municipios-map-wrapper').append(elementHtml);

        allPins[element.id] = {
          lat: element.lat,
          lng: element.lng,
          name: element.name,
          border: 0,
          color: scoreHexColor(element.ibeu, true),
          description: generatePinHtml(element.ranking, element.ibeu, element.d1, element.d2, element.d3, element.d4, element.d5),
          size: 25
        }
      });

      $('#municipios-map-wrapper').append(generateListTitle('Municipios com IBEU mais baixo da UF'));
      worstFive.forEach(element => {
        const elementHtml = generateShortListItemHtml(element.id, element.name, element.ranking, element.ibeu);
        $('#municipios-map-wrapper').append(elementHtml);

        allPins[element.id] = {
          lat: element.lat,
          lng: element.lng,
          name: element.name,
          border: 0,
          color: scoreHexColor(element.ibeu, true),
          description: generatePinHtml(element.ranking, element.ibeu, element.d1, element.d2, element.d3, element.d4, element.d5),
          size: 25
        }
      });

      $('#state-url').text(`Veja todos os municipios de ${state.name}`).attr('href', stateUrl);

      //deploy
      simplemaps_countrymap_mapdata.locations = allPins;
      simplemaps_countrymap.refresh();

      //post-process
      $('text[x="195"]').remove();
    };

    $('#map-ranking-interface button').click(function () {
      $('#map-initial-interface').removeClass('hide');
      $('#map-ranking-interface').removeClass('active');
    });


    // HOME ARTICLES
    $('#home-articles a.nectar-button span').text('Ver dados');

  });
})(jQuery);