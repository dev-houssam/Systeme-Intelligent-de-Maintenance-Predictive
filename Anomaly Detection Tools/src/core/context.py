class SensorContext:
    def __init__(self):
        self.last_values = {}

    def enrich(self, event):
        print("La fonction ENRICH ne fait presque rien ! ")
        print(15*"?")
        print("ENRICH: EVENT=", event)
        last = self.last_values.get(event.sensor_id)
        print("ENRICH: EVENTLAST=", last, "BOOL=", last is not None, "LASTVALUE=", self.last_values)
        try:
            print("ENRICH EVENT-VALUE=", event.value)
            if last is not None:
                print("++++ENRICH EVENT-VALUE=", event.value)
                event.delta = event.value - last
            self.last_values[event.sensor_id] = event.value
            print("ENRICH: EVENTLAST=", last, "BOOL=", last is not None, "LASTVALUE=", self.last_values)

        except Exception as e:
            print("EXCEPT ::: ENRICH EVENT-VALUE=", e)
        print(15*"?")
        print("END ENRICH: EVENT=", event)
        print("La fonction ENRICH ne fait presque rien mais il faut le decouvrir ! ")
        return event
