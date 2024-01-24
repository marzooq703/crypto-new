import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function GeoFencing() {
  const router = useRouter();
  useEffect(() => {
    fetch('https://api.ipregistry.co/?key=l41mnbehxc8mg2a1')
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        console.log(
          payload.location.country.name + ', ' + payload.location.city,
        );
        if (payload.location.country.name.toLowerCase() !== 'india') {
          router.push('/classic/blocked');
        }
      });
  }, []);

  return null; // or render any other UI you need
}

export default GeoFencing;
