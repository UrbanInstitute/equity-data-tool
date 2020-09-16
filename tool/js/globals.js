var barCategories = {  "pct_bach":{
    "full_name": "Residents with a Bachelor’s degree",
    "category": "Education",
    "class": "education"
  },
  "pct_unemp":{
    "full_name": "Unemployed residents",
    "category": "Income/wealth",
    "class": "income"
  },
  "pct_white":{
    "full_name": "White",
    "category": "Race/ethnicity",
    "class": "race"
  },
  "pct_black":{
    "full_name": "Black",
    "category": "Race/ethnicity",
    "class": "race"
  },
  "pct_asian":{
    "full_name": "Asian",
    "category": "Race/ethnicity",
    "class": "race"
  },
  "pct_hisp":{
    "full_name": "Latinx",
    "category": "Race/ethnicity",
    "class": "race"
  },
  "pct_all_other_races":{
    "full_name": "All other races and ethnicities",
    "category": "Race/ethnicity",
    "class": "race"
  },
  "pct_under_poverty_line":{
    "full_name": "Low-income residents",
    "category": "Income/wealth",
    "class": "income"
  },
  "pct_under_200_poverty_line":{
    "full_name": "Extremely low-income residents",
    "category": "Income/wealth",
    "class": "income"
  },
  "pct_cb_renter_hh":{
    "full_name": "Cost burdened renter households",
    "category": "Income/wealth",
    "class": "income"
  },
  "pct_less_hs_diploma":{
    "full_name":  "Residents with less than a High School diploma",
    "category": "Education",
    "class": "education"
  },
  "pct_limited_eng_hh":{
    "full_name": "Households with limited English proficiency",
    "category": "Other demographics",
    "class": "other"
  },
  "pct_renters":{
    "full_name": "Renters ",
    "category": "Other demographics",
    "class": "other"
  },
  "pct_seniors":{
    "full_name": "Seniors (65+)",
    "category": "Age",
    "class": "age"
  },
  "pct_children":{
    "full_name": "Children (under 18)",
    "category": "Age",
    "class": "age"
  },
  "pct_veterans":{
    "full_name": "Veterans",
    "category": "Other demographics",
    "class": "other"
  },
  "pct_disability":{
    "full_name": "Residents with a disability",
    "category": "Other demographics",
    "class": "other"
  },
  "pct_unins":{
    "full_name": "Uninsured residents",
    "category": "Other demographics",
    "class": "other"
  },
  "pct_no_internet":{
    "full_name": "Households without broadband Internet access",
    "category": "Other demographics",
    "class": "other"
  }
}

var defaultParams = {
    "filters":[],
    "weight": "",
    "baseline": "pop",
    "lat_column": "",
    "lon_column": "",
    "year": 2018
  }

const sampleParams = {
    "bike" : {
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
            "lon_column": "lon"
          }
    },
    "hotspots" : {
        "colNames" : ["OBJECTID","NAME","ADDRESS","X","Y","ADDR_ID","LABEL","TYPE","NUMBER_OF_SITES","LATITUDE","LONGITUDE","SITE_TYPE","DATE_OPENED"],
        "csvCols" : {
          "OBJECTID" : "number",
          "NAME" : "string",
          "ADDRESS" : "string",
          "X" : "number",
          "Y" : "number",
          "ADDR_ID" : "number",
          "LABEL" : "string",
          "TYPE" : "string",
          "NUMBER_OF_SITES" : "string",
          "LATITUDE" : "number",
          "LONGITUDE" : "number",
          "SITE_TYPE" : "string",
          "DATE_OPENED" : "date"
        },
        "defaultParams" : {
          "filters": [],
          "weight": "",
          "baseline": "no_internet",
          "lat_column": "LATITUDE",
          "lon_column": "LONGITUDE"
        }
    },
    "three11" : {
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
          "lon_column": "longitude"
        }
    }
}

var errorMessages = {
  "api" : "An unknown error occurred.",
  "processing_time_out" : "An unknown error occurred.",
  "upload" : "An unknown error occurred.",
  "all_rows_filtered" : "This combination of filters removes all rows from your data.",
  "data_readin_error" : "The data file could not be read. Files should use UTF-8, or iso-8859-1 encoding.",
  "df_conversion_to_gdf_failed" : "A mapping error occurred. Latitude and longitude should use the Coordinate Reference System CRS 4326.",
  "filter_coltypes_mismatch" : "One of the columns you selected to filter your data contains a mix of values (e.g., text, number, and/or date).",
  "form-data-parameter-validation-failed" : "",
  "pts_not_in_us_city" : "The provided latitude/longitude coordinates do not fall within a US city. Latitude and longitude should use the Coordinate Reference System CRS 4326.",
  "sjoin_failed" : "A mapping error occurred. Latitude and longitude should use the Coordinate Reference System CRS 4326.",
  "weight_coltypes_mismatch" : "The weighted column contains non-numeric values."
}


const BAR_DOT_RADIUS = 8;
const BAR_LABEL_SCOOTCH = 9;
const MAP_BINS = 8;
const MAP_LEGEND_HEIGHT = 74;
const MAX_PROCESSING_TIME = 10000
const PROCESSING_INTERVAL = 500


var globalFile;