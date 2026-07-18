export const requests = [
  {
    name: 'msc',
    message: '🚢 MSC Cruise',
    selector: '.prices__main-price span',
    url: 'https://www.msccruzeiros.com.br/Search%20Result?area=SOA&embkPort=SSZ&departureDateFrom=05%2F12%2F2026&departureDateTo=05%2F12%2F2026&passengers=2%7C0%7C0%7C0&page=1&ships=VI&nights=6%2C7',
  },
  {
    name: 'skyscanner',
    message: '✈️ Airline ticket',
    selector: '.month-view-variant-total-trip-cost__price > :first-child',
    url: 'https://www.skyscanner.com.br/transporte/passagens-aereas/poa/cgh/?adultsv2=2&cabinclass=economy&childrenv2=&ref=home&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&oym=2612&iym=2612&selectedoday=05&selectediday=12',
  },
]
