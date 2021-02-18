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
  const topEight = region.slice(0, 8);
  const worstEight = region.slice(-8);

  return [topEight, worstEight];
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
    if ($('#municipios-view-wrapper').length) {
      for (let index = 0; index < 20; index++) {
        const element = municipios[index];
        const liHtml = generateListItemHtml(element.id, element.name, element.uf, element.ranking, element.ibeu, element.d1, element.d2, element.d3, element.d4, element.d5);
        $('#municipios-view-wrapper').append(liHtml);
      }

      $('text[href="http://simplemaps.com"]').remove();
      $('text[x="195"]').remove();
    }

    // IBEU MUNICIPAL - PESQUISAR MUNICIPIO
    $('#search-municipio').submit(function (e) {
      e.preventDefault();
      $('#municipios-view-wrapper').empty();
      const pesquisa = $('input[name="search"]').val().toLowerCase();
      municipios.forEach(municipio => {
        if (municipio.name.toLowerCase().includes(pesquisa) || municipio.uf.toLowerCase().includes(pesquisa)) {
          const liHtml = generateListItemHtml(municipio.id, municipio.name, municipio.uf, municipio.ranking, municipio.ibeu, municipio.d1, municipio.d2, municipio.d3, municipio.d4, municipio.d5);
          $('#municipios-view-wrapper').append(liHtml);
        }
      });
    });

    //IBEU MUNICIPAL - CLICAR MUNICIPIO
    $('li.municipio-li').click(function () {
      const municipioId = $(this).attr('id');
      const municipio = getMunicipioById(municipioId);
      const [best, worst] = getBestAndWorstOfRegion(municipio.iduf);
      simplemaps_countrymap.state_zoom("BRA1311");
    });

    // IBEU MUNICIPAL - SORT
    $('.sort').click(function () {
      $('#municipios-view-wrapper').empty();
      $('.sort').removeClass('active');
      $(this).addClass('active');
      const sortBy = $(this).data('sortby');
      const pesquisa = $('input[name="search"]').val().toLowerCase();

      const sortedMunicipios = sortMunicipiosBy(sortBy);

      let counter = 0;
      sortedMunicipios.forEach(municipio => {
        if (counter > 30) {
          return;
        }
        if (municipio.name.toLowerCase().includes(pesquisa) || municipio.uf.toLowerCase().includes(pesquisa)) {
          const liHtml = generateListItemHtml(municipio.id, municipio.name, municipio.uf, municipio.ranking, municipio.ibeu, municipio.d1, municipio.d2, municipio.d3, municipio.d4, municipio.d5);
          $('#municipios-view-wrapper').append(liHtml);
          counter++;
        }
      });
    });

    // IBEU MUNICIPAL - CLICAR ESTADO
    simplemaps_countrymap.hooks.zoomable_click_state = async function (id) {
      $('#municipios-map-wrapper').empty();
      sortMunicipiosBy("ranking");
      const state = simplemaps_countrymap_mapdata.state_specific[id];
      const [topEight, worstEight] = getBestAndWorstOfUf(state.name);

      let allPins = {};

      topEight.forEach(element => {
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

      worstEight.forEach(element => {
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

      simplemaps_countrymap_mapdata.locations = allPins;
      simplemaps_countrymap.refresh();
      $('text[x="195"]').remove();
    };

  });
})(jQuery);