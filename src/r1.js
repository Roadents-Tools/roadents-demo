const t1 = { "route": [
      {
         "waitTimeFromPrev": 0,
         "pt": {"startpt": {
            "latitude": 40.757,
            "longitude": -73.9718
         }},
         "travelTimeFromPrev": 0,
         "walkTimeFromPrev": 0
      },
      {
         "waitTimeFromPrev": 0,
         "pt": {"stationpt": {
            "latitude": 40.757004,
            "name": "5 AV/W 48 ST",
            "id": "jdbc:postgresql://192.168.1.71:5432/Donut::9563",
            "longitude": -73.978432
         }},
         "travelTimeFromPrev": 0,
         "walkTimeFromPrev": 491633
      },
      {
         "waitTimeFromPrev": 14000,
         "pt": {"stationpt": {
            "latitude": 40.560211,
            "name": "HYLAN BL/GUYON AV",
            "id": "jdbc:postgresql://192.168.1.71:5432/Donut::9182",
            "longitude": -74.120438
         }},
         "travelTimeFromPrev": 1000,
         "walkTimeFromPrev": 0
      },
      {
         "waitTimeFromPrev": 0,
         "pt": {"stationpt": {
            "latitude": 40.560574,
            "name": "HYLAN BL/GUYON AV",
            "id": "jdbc:postgresql://192.168.1.71:5432/Donut::8531",
            "longitude": -74.119667
         }},
         "travelTimeFromPrev": 0,
         "walkTimeFromPrev": 64127
      },
      {
         "waitTimeFromPrev": 36000,
         "pt": {"stationpt": {
            "latitude": 40.583298,
            "name": "HYLAN BL/SEAVER AV",
            "id": "jdbc:postgresql://192.168.1.71:5432/Donut::8553",
            "longitude": -74.095665
         }},
         "travelTimeFromPrev": 660000,
         "walkTimeFromPrev": 0
      },
      {
         "waitTimeFromPrev": 0,
         "pt": {"destpt": {
            "latitude": 40.578494676899645,
            "name": "Hip Wo Kitchen",
            "type": {
               "visible_name": "food",
               "encoded_name": "food"
            },
            "longitude": -74.09674472066179
         }},
         "travelTimeFromPrev": 0,
         "walkTimeFromPrev": 392591
      }
   ],
   "start": {
      "latitude": 40.757,
      "longitude": -73.9718
   },
   "starttime": 1500829200000,
   "dest": {
      "latitude": 40.578494676899645,
      "name": "Hip Wo Kitchen",
      "type": {
         "visible_name": "food",
         "encoded_name": "food"
      },
      "longitude": -74.09674472066179
   }
 };

 const routes = [
   t1, t1, t1, t1, t1, t1,t1, t1, t1, t1,
   t1, t1, t1, t1, t1, t1,t1, t1, t1, t1,
   t1, t1, t1, t1, t1, t1,t1, t1, t1, t1
 ];

 export default routes;
