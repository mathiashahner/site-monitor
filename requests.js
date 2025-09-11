export const requests = [
  {
    name: 'msc',
    message: '🚢 MSC Cruise',
    selector: '.prices__main-price span',
    url: 'https://www.msccruzeiros.com.br/ofertas/super-bingo?departureDateFrom=29%2F11%2F2025&departureDateTo=29%2F11%2F2025&passengers=2%7C0%7C0%7C0&area=SOA&nights=6%2C7',
  },
  {
    name: 'skyscanner',
    message: '✈️ Airline ticket',
    selector: '.month-view-variant-total-trip-cost__price > :first-child',
    url: 'https://www.skyscanner.com.br/transporte/passagens-aereas/poa/cgh/?adultsv2=2&cabinclass=economy&childrenv2=&ref=home&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&oym=2511&iym=2512&selectedoday=29&selectediday=06',
  },
]
