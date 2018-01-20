import machine
import utime
import vl53l0x

i2c0 = machine.I2C(scl=machine.Pin(5), sda=machine.Pin(4))
i2c1 = machine.I2C(scl=machine.Pin(14), sda=machine.Pin(12))

vl0 = vl53l0x.VL53L0X(i2c0)
vl1 = vl53l0x.VL53L0X(i2c1)

servo = machine.PWM(machine.Pin(15), freq=50)

def main():
	cDuty = 30
	servo.duty(cDuty)

	vl0.start()
	vl1.start()

	while True:
		while cDuty <= 128:
			servo.duty(cDuty)
			utime.sleep_ms(15)

			dist0 = vl0.read()
			dist1 = vl1.read()
			print(dist0, dist1, str(cDuty))

			cDuty += 2

		while cDuty >= 30:
			servo.duty(cDuty)
			utime.sleep_ms(15)

			dist0 = vl0.read()
			dist1 = vl1.read()
			print(dist0, dist1, str(cDuty))

			cDuty -= 2

if __name__ == '__main__':
	main()
