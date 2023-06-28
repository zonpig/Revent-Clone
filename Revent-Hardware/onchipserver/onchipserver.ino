#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

// includes for arduino node mcu connection
// #include <SoftwareSerial.h>
// SoftwareSerial arduinoSerial(D1, D2); // rx, tx
// Serial0: RX0 on GPIO3, TX0 on GPIO1
// Serial1: RX1 on GPIO9, TX1 on GPIO10 (+CTS1 and RTS1)
// Serial2: RX2 on GPIO16, TX2 on GPIO17 (+CTS2 and RTS2)

const char* ssid     = "saran";
const char* password = "daffodils";
 
WebServer server(80);

// call where necessary to handle CORs
void setCrossOrigin(){
    server.sendHeader(F("Access-Control-Allow-Origin"), F("*"));
    server.sendHeader(F("Access-Control-Max-Age"), F("600"));
    server.sendHeader(F("Access-Control-Allow-Methods"), F("PUT,POST,GET,OPTIONS"));
    server.sendHeader(F("Access-Control-Allow-Headers"), F("*"));
}

void sendCrossOriginHeader(){
    Serial.println(F("sendCORSHeader"));
    server.sendHeader(F("access-control-allow-credentials"), F("false"));
    setCrossOrigin();
    server.send(204);
}
 
// Serving Hello world
void getHelloWord() {
    DynamicJsonDocument doc(512);
    doc["name"] = "Hello world";

    Serial.print(F("Stream..."));
    String buf;
    serializeJson(doc, buf);
    server.send(200, "application/json", buf);
    Serial.print(F("done."));
}

// show settings
void getSettings() {
    // Allocate a temporary JsonDocument
    // Don't forget to change the capacity to match your requirements.
    // Use arduinojson.org/v6/assistant to compute the capacity.
    //  StaticJsonDocument<512> doc;
    // You can use DynamicJsonDocument as well
    DynamicJsonDocument doc(512);

    doc["ip"] = WiFi.localIP().toString();
    doc["gw"] = WiFi.gatewayIP().toString();
    doc["nm"] = WiFi.subnetMask().toString();

    if (server.arg("signalStrength")== "true"){
        doc["signalStrengh"] = WiFi.RSSI();
    }

    if (server.arg("chipInfo")== "true"){
    // doc["chipId"] = ESP.getChipId();
    // doc["flashChipId"] = ESP.getFlashChipId();
    doc["flashChipSize"] = ESP.getFlashChipSize();
    // doc["flashChipRealSize"] = ESP.getFlashChipRealSize();
    }
    if (server.arg("freeHeap")== "true"){
        doc["freeHeap"] = ESP.getFreeHeap();
    }

    Serial.print(F("Stream..."));
    String buf;
    serializeJson(doc, buf);
    server.send(200, F("application/json"), buf);
    Serial.print(F("done."));
}

void writeTag() {
    String postBody = server.arg("plain");
    Serial.println(postBody);
 
    DynamicJsonDocument doc(512);
    DeserializationError error = deserializeJson(doc, postBody);
    if (error) {
        // if the file didn't open, print an error:
        Serial.print(F("Error parsing JSON "));
        Serial.println(error.c_str());
 
        String msg = error.c_str();
 
        server.send(400, F("text/html"),
                "Error in parsin json body! <br>" + msg);
 
    } else {
        JsonObject postObj = doc.as<JsonObject>();
 
        Serial.print(F("HTTP Method: "));
        Serial.println(server.method());

        // Serial.println("Post Data:");
        // serializeJsonPretty(postObj, Serial);
        // Serial.println("");
 
        if (server.method() == HTTP_POST) {
            // check if bare minimum receipt total and time are present in json obj recieved
            if (postObj.containsKey("total") && postObj.containsKey("time")) {
 
                Serial.println(F("done."));

                //save receipt to db and get back url to write to card
                HTTPClient http;
                http.begin("https://us-central1-revent-eco.cloudfunctions.net/addReceipt");
                http.addHeader("Content-Type", "application/json");
                int httpResponseCode = http.POST(postBody);
                if (httpResponseCode > 0) {
                  String response = http.getString();  //Get the response to the request
                  Serial.println(httpResponseCode);   //Print return code
                  Serial.println(response);

                  // send data to arduino over serial2
                  // String jsonStr;
                  // serializeJson(doc, jsonStr);
                  // jsonStr += "%";
                  response += "%";
                  Serial2.write(response.c_str());

                } else {
                  Serial.print("Error on sending POST: ");
                  Serial.println(httpResponseCode);
                }
                http.end();
 
                // Create the response
                // To get the status of the result you can get the http status so
                // this part can be unusefully
                DynamicJsonDocument doc(512);
                doc["status"] = "OK";
 
                Serial.print(F("Stream..."));
                String buf;
                serializeJson(doc, buf);
 
                server.send(201, F("application/json"), buf);
                Serial.print(F("done."));
 
            } else {
                DynamicJsonDocument doc(512);
                doc["status"] = "KO";
                doc["message"] = F("No data found, or incorrect! Please ensure that json object contains at least the total and time keys");
 
                Serial.print(F("Stream..."));
                String buf;
                serializeJson(doc, buf);
 
                server.send(400, F("application/json"), buf);
                Serial.print(F("done."));
            }
        }
    }
}
 
// Define routing
void restServerRouting() {
    Serial.println("routing ran");
    server.on("/", HTTP_GET, []() {
        server.send(200, F("text/html"),
            F("Welcome to the REST Web Server"));
    });
    server.on(F("/helloWorld"), HTTP_GET, getHelloWord);
    server.on(F("/settings"), HTTP_GET, getSettings);
    server.on(F("/writeTag"), HTTP_POST, writeTag);
}
 
// Manage not found URL
void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}
 
void setup(void) {
  Serial.begin(9600);

  // begin arduinoSerial
  Serial2.begin(9600); // arduinoSerial.begin(115200); 

  // WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");
 
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
 
  // Activate mDNS this is used to be able to connect to the server
  // with local DNS hostmane esp8266.local
  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }
 
  // Set server routing
  restServerRouting();
  // Set not found response
  server.onNotFound(handleNotFound);
  // Start server
  server.begin();
  Serial.println("HTTP server started");

  // Serial2.write("hi from mcu%");
}
 
void loop(void) {
  // read serial data coming from arduino
  // String msg = Serial2.readStringUntil('%');  // readStringUntil('%'); // String msg = arduinoSerial.readStringUntil('\r');
  // Serial.print("message from arduino: ");
  // Serial.println(msg);

  // Serial2.write("hi from mcu%");
  // server
  server.handleClient();
}
