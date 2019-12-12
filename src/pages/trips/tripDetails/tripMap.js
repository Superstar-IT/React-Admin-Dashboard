import React, {Component} from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { pinTripGreen, pinTripRed, pinTripBlack }from '../../../assets/images/index';

export class TripMap extends Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      selectedPlace: {},
      activeMarker: {},
      showingInfoWindow: false,
    };
  }

  componentDidUpdate() {
    const { google, markers } = this.props;
    this.bounds = new google.maps.LatLngBounds();
    markers.map((marker,i) => {
      if (i===2) {
        if (marker) {
          this.bounds.extend({lat: marker.lat, lng: marker.lng});
        }
      } else {
        this.bounds.extend({lat: marker.latlong.lat, lng: marker.latlong.lon})
      }
      return 1;
    });
    this.mapRef.current.map.fitBounds(this.bounds);
  }

  render() {
    const { activeMarker, showingInfoWindow, selectedPlace} = this.state;
    const { markers, tracking, google} = this.props;
    return (
      <Map
        style={{width: '97%', height: '97%'}}
        google={google}
        zoom={12}
        initialCenter={{
             lat: 40.7127,
             lng: -74.0059
           }}
        ref={this.mapRef}
      >

        {markers.map((marker, i) => (
          <Marker
            key={(i===2 && marker) ? marker.lat : !marker ? 1 : marker.latlong.lat}
            position={i===2 ? {lat: marker.lat, lng: Number(marker.lng)} : {lat: marker.latlong.lat, lng: marker.latlong.lon}}
            icon={i===0 ? {
              url: pinTripRed,
            } : (i===2) ? {
              url: pinTripBlack,
            }: {
              url: pinTripGreen,
            }}
          />
        ))}
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
        >
          <div>
            <h1>{selectedPlace.name}</h1>
          </div>
        </InfoWindow>
        <Polyline
          path={tracking}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyC5YIg8-Yk_zqjzWpFyZrgYuzzjTCBJV7k')
})(TripMap)