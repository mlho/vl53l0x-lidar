# This file is executed on every boot (including wake-boot from deepsleep)
import gc
import webrepl
webrepl.start()
import machine
import network
import socket
import framebuf
import ssd1306

# i2c = machine.I2C(scl=machine.Pin(5), sda=machine.Pin(4))
# oled = ssd1306.SSD1306_I2C(128, 64, i2c)

sta_if = network.WLAN(network.STA_IF)

def bootScreen():
    oled.fill(0)
    oled.text('[ boot ]', 0, 0)
    oled.show()

def do_connect():
    # oled.text('[ connecting ]', 0, 10)
    # oled.show()

    if not sta_if.isconnected():
        print('connecting to network...')
        sta_if.active(True)
        sta_if.connect('sharon', '5167752862')

        # x = 4
        while not sta_if.isconnected():
            pass
        #     if x >= 108:
        #        x = 4
        #        oled.framebuf.fill_rect(4, 22, 104, 2, 0)
        #
        #     oled.framebuf.rect(2, 20, 108, 6, 1)
        #     oled.framebuf.vline(x, 22, 2, 1)
        #     oled.show()
        #     x += 1

    print('network config:', sta_if.ifconfig())
    ip = sta_if.ifconfig()[0]

    # oled.text('[ online ]', 0, 30)
    # oled.text(str(ip), 0, 54)
    # oled.show()


gc.collect()
# bootScreen()
do_connect()
