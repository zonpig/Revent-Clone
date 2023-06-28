#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>
PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);
String tagId = "None";
byte nuidPICC[4];

#define LED 7
#define PN532_POWER 52
String prevUri = "";
 
void setup(void) 
{
 pinMode(PN532_POWER, OUTPUT);
//  digitalWrite(PN532_POWER, HIGH);
 Serial.begin(9600);
 Serial3.begin(9600);
 Serial.println("System initialized%");
//  nfc.begin();
//  delay(100);
//  digitalWrite(PN532_POWER, LOW);

 pinMode(LED , OUTPUT);
}

// writeToCard
// takes in a url to write
// starts nfc reader and writes the url to the card or if no card found then try to find card 10 times and then timeout
// returns true if success else returns false
bool writeDataToCard(String uri)
{
  // digitalWrite(PN532_POWER, HIGH);
  // nfc.begin();
  // delay(500);

  // will try to find a card and write to it. Will keep looking for 10s
  if (uri != prevUri && uri.startsWith("https://")) {
    digitalWrite(LED, HIGH);
    prevUri = uri;
  } else return;
  
  for (int i = 0; i < 20; i++)
  {

    // wait first
    delay(100);

    // check card present
    if (!nfc.tagPresent()) {
      Serial.println("tag not detected. Will try again in 1s...");
      continue;
    }

    // if tag is present, read tag data and print for debugging purposes
    NfcTag tag = nfc.read();
    tag.print();
    tagId = tag.getUidString();

    // Write the URL to the desired block
    NdefMessage message;
    NdefMessage& messageRef = message;
    if (!nfc.write(messageRef)) {
      Serial.println("Failed to format NFC card.");
      digitalWrite(LED, LOW);
      return false;
    }

    Serial.println("Card formatted successfully.");

    // write url
    NdefMessage actualUrlMessage;
    NdefMessage& actualUrlMessageRef = actualUrlMessage;
    actualUrlMessage.addUriRecord(uri);
    if (!nfc.write(actualUrlMessageRef)) {
      Serial.println("Failed to write url");
      digitalWrite(LED, LOW);
      return false;
    }

    Serial.println("Wrote url successfully!%");
    digitalWrite(LED, LOW);
    return true;

  }

  Serial.println("Timed out! Tag not detected after 20 tries");
  digitalWrite(LED, LOW);
  return false;
}
 
void loop() 
{
    String msg = Serial3.readStringUntil('%');
    if (msg.length() != 0) {
      Serial.print("message from node mcu: ");
      Serial.println(msg);

      digitalWrite(PN532_POWER, HIGH);
      nfc.begin();
      delay(500);
      writeDataToCard(msg);
      digitalWrite(PN532_POWER, LOW);

    }                 
}





