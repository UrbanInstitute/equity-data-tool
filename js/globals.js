var barCategories = {
  "pct_black": "Black residents (non-Latinx)",
  "pct_white": "White residents (non-Latinx)",
  "pct_asian": "Asian residents (non-Latinx) ",
  "pct_hisp": "Latinx residents",
  "pct_all_other_races": "Residents of another race or ethnicity (non-Latinx)",
  "pct_children": "Children (&lt; 18)",
  "pct_seniors": "Seniors (&ge; 65) ",
  "pct_veterans": "Veterans",
  "pct_no_internet": "Households without internet access",
  "pct_unins": "Residents without insurance",
  "pct_disability": "Residents with disabilities",
  "pct_renters": "Renters ",
  "pct_limited_eng_hh": "Households with limited English proficiency",
  "pct_bach": "Residents with a bachelor&rsquo;s degree ",
  "pct_under_poverty_line": "Residents with extremely low incomes<i data-tt=\"pov\" class = \"tt-icon\">?</i>",
  "pct_under_200_poverty_line": "Residents with low incomes<i data-tt=\"pov2\" class = \"tt-icon\">?</i>",
  "pct_cb_renter_hh": "Cost-burdened renter households<i data-tt=\"cbr\" class = \"tt-icon\">?</i>",
  "pct_unemp": "Residents who are unemployed",
  "pct_less_hs_diploma": "Residents with less than a high school diploma",
  "pct_under18_unins": "Residents without insurance (&lt; age 19)",
  "pct_under18_disability": "Residents with disabilities",
  "pct_under18_renters": "TO BE REMOVED (renters)",
  "pct_under18_pov": "Residents with extremely low incomes<i data-tt=\"pov\" class = \"tt-icon\">?</i>",
  "pct_under18_limited_eng_hh": "Households with limited English proficiency",
  "pct_under18_white_alone": "White residents",
  "pct_under18_black_alone": "Black residents",
  "pct_under18_asian_alone": "Asian residents",
  "pct_under18_hisp": "Latinx residents",
  "pct_under18_all_other_races_alone": "Residents of another race or ethnicity ",
  "pct_pov_children": "Children (&lt; 18)",
  "pct_pov_seniors": "Seniors (&ge; 65) ",
  "pct_pov_white_alone": "White residents",
  "pct_pov_black_alone": "Black residents",
  "pct_pov_asian_alone": "Asian residents",
  "pct_pov_hisp": "Latinx residents",
  "pct_pov_all_other_races_alone": "",
  "pct_pov_bach": "Residents with a bachelor&rsquo;s degree",
  "pct_pov_less_than_hs": "Residents with less than a high school diploma",
  "pct_pov_foreign_born": "TO BE REMOVED",
  "pct_pov_unemployed": "Residents who are unemployed",
  "pct_pov_veterans": "Veterans",
  "pct_pov_disability": "Residents with disabilities",
  "pct_pov_unins": "Residents without insurance"
}

var defaultParams = {
    "filters":[],
    "weight": "",
    "baseline": "pop",
    "lat_column": "",
    "lon_column": "",
    "year": 2019
  }

const sampleParams = {
    "bike" : {
        "fileId" : "1634153008-414873",
        "job_id": "minneapolis_bikes",
        "geographyLevel" : "city",

        "colNames" : ["short_name","station_type","station_id","region_id","eightd_has_key_dispenser","has_kiosk","external_id","legacy_id","lon","capacity","electric_bike_surcharge_waiver","lat","name","rack_model","dockless_bikes_parking_zone_capacity","address","region_code","client_station_id"],
        "csvCols" : {
            "short_name": "number",
            "station_type": "string",
            "station_id": "number",
            "region_id": "number",
            "eightd_has_key_dispenser": "string",
            "has_kiosk": "string",
            "external_id": "string",
            "legacy_id": "number",
            "lon": "number",
            "capacity": "number",
            "electric_bike_surcharge_waiver": "string",
            "lat": "number",
            "name": "string",
            "rack_model": "string",
            "dockless_bikes_parking_zone_capacity": "number",
            "address": "string",
            "region_code": "string",
            "client_station_id": "string"
        },
        "defaultParams" : {
          "filters": [],
          "weight": "capacity",
          "baseline": "pop",
          "lat_column": "lat",
          "lon_column": "lon",
          "geo": "city",
          "year": 2019
        }
    },
    "hotspots" : {
        "fileId" : "1634153599-527906",
        "job_id": "new_york_wifi",
        "geographyLevel" : "city",
        "colNames" : ["OBJECTID","Borough","Type","Provider","Name","Location","Latitude","Longitude","X","Y","Location_T","Remarks","City","SSID","SourceID","Activated","BoroCode","Borough Name","Neighborhood Tabulation Area Code (NTACODE)","Neighborhood Tabulation Area (NTA)","Council Distrcit","Postcode","BoroCD","Census Tract","BCTCB2010","BIN","BBL","DOITT_ID","Location (Lat, Long)"],
        "csvCols" : {
          "OBJECTID" : "number",
          "Borough" : "number",
          "Type" : "string",
          "Provider" : "string",
          "Name" : "string",
          "Location" : "string",
          "Latitude" : "number",
          "Longitude" : "number",
          "X" : "number",
          "Y" : "number",
          "Location_T" : "string",
          "Remarks" : "string",
          "City" : "string" ,
          "SSID" : "string",
          "SourceID" : "string",
          "Activated" : "date",
          "BoroCode" : "number",
          "Borough Name" : "string",
          "Neighborhood Tabulation Area Code (NTACODE)" : "string",
          "Neighborhood Tabulation Area (NTA)" : "string",
          "Council Distrcit" : "number",
          "Postcode" : "number",
          "BoroCD" : "number",
          "Census Tract" : "number",
          "BCTCB2010" : "number",
          "BIN" : "number",
          "BBL" : "number",
          "DOITT_ID" : "number",
          "Location (Lat, Long)" : "string"
        },
        "defaultParams" : {
          "filters": [],
          "weight": "",
          "baseline": "int",
          "lat_column": "Latitude",
          "lon_column": "Longitude",
          "geo": "city"
        }
    },
    "three11" : {
        "fileId" : "1634153502-993203",
        "job_id": "new_orleans_311",
        "geographyLevel" : "city",
        "colNames" : ["ticket_id","issue_type","ticket_created_date_time","ticket_closed_date_time","ticket_status","issue_description","street_address","neighborhood_district","council_district","city","state","zip_code","location","geom","latitude","longitude","closure_reason","case_title"],
        "csvCols" : {
          "ticket_id" : "number",
          "issue_type" : "string",
          "ticket_created_date_time" : "date",
          "ticket_closed_date_time" : "date",
          "ticket_status" : "string",
          "issue_description" : "string",
          "street_address" : "string",
          "neighborhood_district" : "string",
          "council_district" : "string",
          "city" : "string",
          "state" : "string",
          "zip_code" : "number",
          "location" : "string",
          "geom" : "string",
          "latitude" : "number",
          "longitude" : "number",
          "closure_reason" : "string",
          "case_title" : "string"
        },
        "defaultParams" : {
          "filters": [
              {
                  "filter_type": "string",
                  "filter_column": "city",
                  "filter_comparison": "==",
                  "filter_val": "NEW ORLEANS"
              },
              {
                  "filter_type": "date",
                  "filter_column": "ticket_created_date_time",
                  "filter_comparison": "dateRange",
                  "filter_val": "01/01/2014-01/01/2019"
              }
          ],
          "weight": "",
          "baseline": "pop",
          "lat_column": "latitude",
          "lon_column": "longitude",
          "geo": "city"
        }
    },
    "playgrounds": {
      "fileId": "1634151603-211859",
      "job_id": "miami_dade_county_fl_playgrounds",
      "geographyLevel" : "county",
      "colNames": ["X","Y","OBJECTID","FOLIO","ID","NAME","ADDRESS","CITY","ZIPCODE","PHONE","CONTACT","TOTACRE","LAT","LON","POINT_X","POINT_Y","CLASS","TYPE","MNGTAGCY","MUNICIPAL_","PROPNUM","FACILITYPLAN","PARKURL","AMPHITHEAT","ARCHERY","ART","AUDITORIUM","BASEBALL","BASKETBALL","BEACH","BIKETRAIL","BMXTRACK","BOATRAMP","CAMPGROUND","CANOE_LAUNCH","DOGPARK","EQUESTRIAN","FITNESSZONE","FOOTBALL","FRISBEEGOL","GOLF","GOLFDRIVIN","GUNRANGE","GYMNASIUM","MARINA","MOUNTAINBI","NATURECENT","NATURETRAI","PLAYGROUND","RAQUETBALL","REC_CENTER","RESTROOM","ROLLERHOCK","RVCAMPGROU","SHELTER","SKATING","SOCCER","STADIUM","SWIMMING","TENNIS","TOTLOT","TRACK400","TRAIL","VOLLEYBALL","WETPLAYGRO","WIFI","ZOO","GlobalID","created_user","created_date","last_edited_user","last_edited_date","FIT2PLAY","LRN2SWIM","SPRCAMP","SUMCAMP","AFTSCHCAMP","ACTOLDADLPRG","WINTCAMP","ONEDAYCAMP","STARTIME","ENDTIME"],
      "csvCols": {
        "X": "number",
        "Y": "number",
        "OBJECTID": "number",
        "FOLIO": "number",
        "ID": "string",
        "NAME": "string",
        "ADDRESS": "string",
        "CITY": "string",
        "ZIPCODE": "number",
        "PHONE": "string",
        "CONTACT": "string",
        "TOTACRE": "number",
        "LAT": "number",
        "LON": "number",
        "POINT_X": "number",
        "POINT_Y": "number",
        "CLASS": "string",
        "TYPE": "string",
        "MNGTAGCY": "string",
        "MUNICIPAL_": "string",
        "PROPNUM": "number",
        "FACILITYPLAN": "string",
        "PARKURL": "string",
        "AMPHITHEAT": "string",
        "ARCHERY": "string",
        "ART": "string",
        "AUDITORIUM": "string",
        "BASEBALL": "string",
        "BASKETBALL": "string",
        "BEACH": "string",
        "BIKETRAIL": "string",
        "BMXTRACK": "string",
        "BOATRAMP": "string",
        "CAMPGROUND": "string",
        "CANOE_LAUNCH": "string",
        "DOGPARK": "string",
        "EQUESTRIAN": "string",
        "FITNESSZONE": "string",
        "FOOTBALL": "string",
        "FRISBEEGOL": "string",
        "GOLF": "string",
        "GOLFDRIVIN": "string",
        "GUNRANGE": "string",
        "GYMNASIUM": "string",
        "MARINA": "string",
        "MOUNTAINBI": "string",
        "NATURECENT": "string",
        "NATURETRAI": "string",
        "PLAYGROUND": "string",
        "RAQUETBALL": "string",
        "REC_CENTER": "string",
        "RESTROOM": "string",
        "ROLLERHOCK": "string",
        "RVCAMPGROU": "string",
        "SHELTER": "string",
        "SKATING": "string",
        "SOCCER": "string",
        "STADIUM": "string",
        "SWIMMING": "string",
        "TENNIS": "string",
        "TOTLOT": "string",
        "TRACK400": "string",
        "TRAIL": "string",
        "VOLLEYBALL": "string",
        "WETPLAYGRO": "string",
        "WIFI": "string",
        "ZOO": "string",
        "GlobalID": "string",
        "created_user": "string",
        "created_date": "date",
        "last_edited_user": "string",
        "last_edited_date": "date",
        "FIT2PLAY": "string",
        "LRN2SWIM": "string",
        "SPRCAMP": "string",
        "SUMCAMP": "string",
        "AFTSCHCAMP": "string",
        "ACTOLDADLPRG": "string",
        "WINTCAMP": "string",
        "ONEDAYCAMP": "string",
        "STARTIME": "string",
        "ENDTIME": "string"
      },
      "defaultParams":{
        "filters": [{
          "filter_type": "string",
          "filter_column": "TOTLOT",
          "filter_comparison": "==",
          "filter_val": "Yes"
        }],
        "weight": "",
        "baseline": "chi",
        "year": 2019,
        "lat_column": "LAT",
        "lon_column": "LON",
        "geo": "county"
      }
    },
    "polling": {
      "geographyLevel" : "county",
      "job_id": "bucks_county_pa_polling_places",
      "fileId": "1634151463-278735",
      "colNames": ["X","Y","OBJECTID","name","fulladdr","POST_OFFIC","facilityid","Prec_ID","pocname","pocphone","NEXTELECT","pocemail","OPERHOURS","HANDICAP","Municipality","GlobalID","type","agencyurl","dropbox","boxlocation","comments","pstlstate","pstlzip5","operdays","earlyvoting","voteservices","phone","regdate","earlyvotingdate","hours"],
      "csvCols": {
        "X": "number",
        "Y": "number",
        "OBJECTID": "number",
        "name": "string",
        "fulladdr": "string",
        "POST_OFFIC": "string",
        "facilityid": "number",
        "Prec_ID": "string",
        "pocname": "string",
        "pocphone": "string",
        "NEXTELECT": "date",
        "pocemail": "string",
        "OPERHOURS": "string",
        "HANDICAP": "string",
        "Municipality": "string",
        "GlobalID": "string",
        "type": "string",
        "agencyurl": "string",
        "dropbox": "string",
        "boxlocation": "string",
        "comments": "string",
        "pstlstate": "string",
        "pstlzip5": "number",
        "operdays": "string",
        "earlyvoting": "string",
        "voteservices": "string",
        "phone": "string",
        "regdate": "date",
        "earlyvotingdate": "string",
        "hours": "string"
      },
      "defaultParams": {
        "filters": [],
        "weight": "",
        "baseline": "pop",
        "lat_column": "Y",
        "lon_column": "X",
        "geo": "county",
        "year": 2019,
      }
    },
    "health": {
      "geographyLevel" : "state",
      "job_id": "wa_mental_health",
      "fileId": "1634155998-414971",
      "defaultParams": {
        "filters": [{
          "filter_type": "string",
          "filter_column": "state",
          "filter_comparison": "==",
          "filter_val": "WA"
        }],
        "weight": "",
        "baseline": "pop",
        "year": 2019,
        "lat_column": "latitude",
        "lon_column": "longitude",
        "geo": "state"
      },
      "colNames": ["name1","name2","street1","street2","city","state","zip","zip4","county","phone","intake_prompt","intake1","intake2","website","latitude","longitude","type_facility"],
      "csvCols": {
        "name1": "string",
        "name2": "string",
        "street1": "string",
        "street2": "string",
        "city": "string",
        "state": "string",
        "zip": "number",
        "zip4": "number",
        "county": "string",
        "phone": "string",
        "intake_prompt": "string",
        "intake1": "string",
        "intake2": "string",
        "website": "string",
        "latitude": "number",
        "longitude": "number",
        "type_facility": "string"
      }
    },
    "housing": {
      "geographyLevel" : "state",
      "job_id": "al_lihtc",
      "fileId": "1634151296-824826",
      "defaultParams": {
        "filters": [],
        "weight": "LI_UNITS",
        "baseline": "pop",
        "year": 2019,
        "lat_column": "LATITUDE",
        "lon_column": "LONGITUDE",
        "geo": "state"
      },
      "colNames": ["HUD_ID","PROJECT","PROJ_ADD","PROJ_CTY","PROJ_ST","PROJ_ZIP","LATITUDE","LONGITUDE","N_UNITS","LI_UNITS","NONPROG","...12"],
      "csvCols": {
        "HUD_ID": "string",
        "PROJECT": "string",
        "PROJ_ADD": "string",
        "PROJ_CTY": "string",
        "PROJ_ST": "string",
        "PROJ_ZIP": "number",
        "LATITUDE": "number",
        "LONGITUDE": "number",
        "N_UNITS": "number",
        "LI_UNITS": "number",
        "NONPROG": "number",
        "...12": "string"
      }
    },
    "electric": {
      "geographyLevel" : "national",
      "job_id": "us_alt_fuel_stations",
      "fileId": "1634156102-609030",
      "defaultParams": {
        "filters": [],
        "weight": "",
        "baseline": "pop",
        "year": 2019,
        "lat_column": "Latitude",
        "lon_column": "Longitude",
        "geo": "national"
      },
      "colNames": ["Fuel Type Code","Station Name","Street Address","Intersection Directions","City","State","ZIP","Plus4","Station Phone","Status Code","Expected Date","Groups With Access Code","Access Days Time","Cards Accepted","BD Blends","NG Fill Type Code","NG PSI","EV Level1 EVSE Num","EV Level2 EVSE Num","EV DC Fast Count","EV Other Info","EV Network","EV Network Web","Geocode Status","Latitude","Longitude","Date Last Confirmed","ID","Updated At","Owner Type Code","Federal Agency ID","Federal Agency Name","Open Date","Hydrogen Status Link","NG Vehicle Class","LPG Primary","E85 Blender Pump","EV Connector Types","Country","Intersection Directions (French)","Access Days Time (French)","BD Blends (French)","Groups With Access Code (French)","Hydrogen Is Retail","Access Code","Access Detail Code","Federal Agency Code","Facility Type","CNG Dispenser Num","CNG On-Site Renewable Source","CNG Total Compression Capacity","CNG Storage Capacity","LNG On-Site Renewable Source","E85 Other Ethanol Blends","EV Pricing","EV Pricing (French)","LPG Nozzle Types","Hydrogen Pressures","Hydrogen Standards","CNG Fill Type Code","CNG PSI","CNG Vehicle Class","LNG Vehicle Class","EV On-Site Renewable Source"],
      "csvCols": {
        "Fuel Type Code": "string",
        "Station Name": "string",
        "Street Address": "string",
        "Intersection Directions": "string",
        "City": "string",
        "State": "string",
        "ZIP": "number",
        "Plus4": "string",
        "Station Phone": "string",
        "Status Code": "string",
        "Expected Date": "string",
        "Groups With Access Code": "string",
        "Access Days Time": "string",
        "Cards Accepted": "string",
        "BD Blends": "string",
        "NG Fill Type Code": "string",
        "NG PSI": "string",
        "EV Level1 EVSE Num": "number",
        "EV Level2 EVSE Num": "number",
        "EV DC Fast Count": "number",
        "EV Other Info": "string",
        "EV Network": "string",
        "EV Network Web": "string",
        "Geocode Status": "string",
        "Latitude": "number",
        "Longitude": "number",
        "Date Last Confirmed": "date",
        "ID": "number",
        "Updated At": "date",
        "Owner Type Code": "string",
        "Federal Agency ID": "number",
        "Federal Agency Name": "string",
        "Open Date": "date",
        "Hydrogen Status Link": "string",
        "NG Vehicle Class": "string",
        "LPG Primary": "string",
        "E85 Blender Pump": "string",
        "EV Connector Types": "string",
        "Country": "string",
        "Intersection Directions (French)": "string",
        "Access Days Time (French)": "string",
        "BD Blends (French)": "string",
        "Groups With Access Code (French)": "string",
        "Hydrogen Is Retail": "string",
        "Access Code": "string",
        "Access Detail Code": "string",
        "Federal Agency Code": "string",
        "Facility Type": "string",
        "CNG Dispenser Num": "string",
        "CNG On-Site Renewable Source": "string",
        "CNG Total Compression Capacity": "string",
        "CNG Storage Capacity": "string",
        "LNG On-Site Renewable Source": "string",
        "E85 Other Ethanol Blends": "string",
        "EV Pricing": "string",
        "EV Pricing (French)": "string",
        "LPG Nozzle Types": "string",
        "Hydrogen Pressures": "string",
        "Hydrogen Standards": "string",
        "CNG Fill Type Code": "string",
        "CNG PSI": "string",
        "CNG Vehicle Class": "string",
        "LNG Vehicle Class": "string",
        "EV On-Site Renewable Source": "string"
      }
    },
    "libraries":{
      "geographyLevel" : "national",
      "job_id": "us_library_outlets",
      "fileId": "1634156158-233252",
      "defaultParams": {
        "filters": [],
        "weight": "HOURS",
        "baseline": "pop",
        "year": 2019,
        "lat_column": "LATITUDE",
        "lon_column": "LONGITUD",
        "geo": "national"
      },
      "colNames": ["STABR","FSCSKEY","FSCS_SEQ","C_FSCS","LIBID","LIBNAME","ADDRESS","CITY","ZIP","ZIP4","CNTY","PHONE","C_OUT_TY","SQ_FEET","F_SQ_FT","L_NUM_BM","HOURS","F_HOURS","WKS_OPEN","F_WKSOPN","YR_SUB","OBEREG","STATSTRU","STATNAME","STATADDR","LONGITUD","LATITUDE","INCITSST","INCITSCO","GNISPLAC","CNTYPOP","LOCALE","CENTRACT","CENBLOCK","CDCODE","CBSA","MICROF","GEOMATCH"],
      "csvCols": {
        "STABR": "string",
        "FSCSKEY": "string",
        "FSCS_SEQ": "number",
        "C_FSCS": "string",
        "LIBID": "string",
        "LIBNAME": "string",
        "ADDRESS": "string",
        "CITY": "string",
        "ZIP": "number",
        "ZIP4": "number",
        "CNTY": "string",
        "PHONE": "number",
        "C_OUT_TY": "string",
        "SQ_FEET": "number",
        "F_SQ_FT": "string",
        "L_NUM_BM": "number",
        "HOURS": "number",
        "F_HOURS": "string",
        "WKS_OPEN": "number",
        "F_WKSOPN": "string",
        "YR_SUB": "number",
        "OBEREG": "number",
        "STATSTRU": "number",
        "STATNAME": "number",
        "STATADDR": "number",
        "LONGITUD": "number",
        "LATITUDE": "number",
        "INCITSST": "number",
        "INCITSCO": "number",
        "GNISPLAC": "number",
        "CNTYPOP": "number",
        "LOCALE": "number",
        "CENTRACT": "number",
        "CENBLOCK": "number",
        "CDCODE": "number",
        "CBSA": "number",
        "MICROF": "string",
        "GEOMATCH": "string"
      }
    }
}

var errorMessages = {
  "api" : "An unknown error occurred.",
  "processing_time_out" : "An unknown error occurred.",
  "upload" : "An unknown error occurred.",
  "all_rows_filtered" : "This combination of filters removes all rows from your data.",
  "data_readin_error" : "The data file could not be read. Files should use utf-8, utf-16, or iso-8859-1 encoding. ",
  "df_conversion_to_gdf_failed" : "A mapping error occurred. Latitude and longitude should use the  WGS 84 coordinate reference system (ie EPSG:4326)",
  "filter_coltypes_mismatch" : "A column you selected to filter your data contains a mix of values (e.g., text, number, and/or date).",
  "form-data-parameter-validation-failed" : "An unknown error occurred.",
  "latlon_cols_not_in_data" : "The provided latitude-longitude coordinates do not fall within a US city. Latitude and longitude should use the WGS 84 coordinate reference system (ie EPSG:4326)",
  "pts_not_in_us_city" : "The provided latitude-longitude coordinates do not fall within a US city. Latitude and longitude should use the WGS 84 coordinate reference system (ie EPSG:4326)",
  "sjoin_failed" : "A mapping error occurred. Latitude and longitude should use the Coordinate Reference System CRS 4326.",
  "weight_coltypes_mismatch" : "The selected weight column contains non-numeric values."
}
var globalPercent = d3.format(".1%")

var legendHeight = 20,
    legendMargin = 18;
const BAR_DOT_RADIUS_LARGE = 10;
const BAR_DOT_RADIUS_SMALL = 6;
const BAR_ROW_HEIGHT = 40;
const BAR_LABEL_SCOOTCH = 9;
const MAP_BINS = 8;
const MAX_PROCESSING_TIME = 60000
const PROCESSING_INTERVAL = 500
const BAR_AXIS_LABEL_SCOOTCH = 13;


var globalFile;

function widthBelow(w){
  return d3.select("#widthBelow" + w).style("display") == "block"
}


// polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) { 
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/beeswarm
function dodge(X, radius) {
    const Y = new Float64Array(X.length);
    const radius2 = radius ** 2;
    const epsilon = 1e-3;
    let head = null, tail = null;
  
    // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    function intersects(x, y) {
      let a = head;
      while (a) {
        const ai = a.index;
        if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
        a = a.next;
      }
      return false;
    }
  
    // Place each circle sequentially.
    for (const bi of d3.range(X.length).sort((i, j) => X[i] - X[j])) {

      // Remove circles from the queue that can’t intersect the new circle b.
      while (head && X[head.index] < X[bi] - radius2) head = head.next;
  
      // Choose the minimum non-intersecting tangent.
      if (intersects(X[bi], Y[bi] = 0)) {
        let a = head;
        Y[bi] = Infinity;
        do {
          const ai = a.index;
          let y = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
          if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
          a = a.next;
        } while (a);
      }
  
      // Add b to the queue.
      const b = {index: bi, next: null};
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }
  
    return Y;
}