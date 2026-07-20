export const requests = [
  {
    name: 'msc-virtuosa',
    message: '🚢 MSC Virtuosa',
    url: 'https://www.msccruzeiros.com.br/Search%20Result?area=SOA&embkPort=SSZ&departureDateFrom=01%2F11%2F2026&departureDateTo=30%2F04%2F2027&passengers=2%7C0%7C0%7C0&page=1&ships=VI&nights=6%2C7',
    steps: [{ selector: '.prices__main-price span' }],
  },
  {
    name: 'msc-virtuosa-05-12',
    message: '🚢 MSC Virtuosa 05/12',
    url: 'https://www.msccruzeiros.com.br/Search%20Result?area=SOA&embkPort=SSZ&departureDateFrom=05%2F12%2F2026&departureDateTo=05%2F12%2F2026&passengers=2%7C0%7C0%7C0&page=1&ships=VI&nights=6%2C7',
    steps: [{ selector: '.prices__main-price span' }],
  },
  {
    name: 'msc-voyagers-club',
    message: '🚢 MSC Voyagers Club',
    url: 'https://www.msccruzeiros.com.br/gerenciar-reserva/msc-voyagers-club/msc-voyagers-selection-15?departureDateFrom=05%2F12%2F2026&departureDateTo=05%2F12%2F2026&passengers=2%7C0%7C0%7C0&area=SOA&embkPort=SSZ&nights=6%2C7',
    steps: [{ selector: '.prices__main-price span' }],
  },
  {
    name: 'msc-super-bingo',
    message: '🚢 MSC Super Bingo',
    // url: 'https://www.msccruzeiros.com.br/ofertas/super-bingo?departureDateFrom=21%2F07%2F2026&departureDateTo=21%2F06%2F2029&passengers=2%7C0%7C0%7C0&area=SOA&nights=6%2C7',
    url: 'https://www.msccruzeiros.com.br/ofertas/super-bingo?departureDateFrom=21%2F07%2F2026&departureDateTo=21%2F06%2F2029&passengers=2%7C0%7C0%7C0&area=SOA&nights=6%2C7&ships=VI',
    steps: [{ selector: '.prices__main-price span' }],
  },
  // {
  //   name: 'skyscanner',
  //   message: '✈️ Airline ticket',
  //   selector: '.month-view-variant-total-trip-cost__price > :first-child',
  //   url: 'https://www.skyscanner.com.br/transporte/passagens-aereas/poa/cgh/?adultsv2=2&cabinclass=economy&childrenv2=&ref=home&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&oym=2612&iym=2612&selectedoday=05&selectediday=12',
  // },
]
