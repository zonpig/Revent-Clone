# Revent Hardware

The Revent device integrates with POS terminals to enable contactless distribution of e-receipts. Customers can receive their receipts by simply tapping their smartphones on the Revent device

## Hardware connections

![hardware connections](https://github.com/Revent-eco/Revent/blob/main/Revent-Hardware/documentation/connection.png)

The pins of the various modules are connected as per the diagram above. And the MIFARE Classic Card is place on top of the PN532.

## Setting up for software development

In order to start developing on this hardware. We use Arduino IDE coupled with the following libraries.

1. ArduinoJson
2. NDEF
3. PN532
4. PN532_I2C

## Future Development

Goals include stripping away excess hardware components to reduce cost and adding various new functionality, additional security layers and other features.
