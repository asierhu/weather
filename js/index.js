jQuery(document).ready(function () {
    const key = '6f899d4fb1f91461bd6cae8c9958aaa5'
    //---------------------------------------Lat y Lon actual---------------------------------------
    $('#verUbicacionAct').on('click', function (event) {
        event.preventDefault();
        lat = ""
        lon = ""
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (localizacion) {
                    lat = localizacion.coords.latitude;
                    lon = localizacion.coords.longitude;
                },
                function (error) { // Error al obtener ubicación
                    if (error.code != null) {
                        alert("Ocurrió un error desconocido. " + error.message);
                    }
                }
            );
        } else {
            alert("La geolocalización no es soportada por este navegador.");
        }
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`,
            type: 'GET',
            success: function (respuesta) {
                if (respuesta.length > 0) {
                    respuesta.forEach(function (tiempo) {
                        const nombre = tiempo.name;
                        const lat = tiempo.main.temp;
                        const lon = tiempo.main.humidity;
                        const pais = tiempo.wind.speed;

                        $('#tiempoCiudadAct').append(`<p>${nombre} -- ${lat} -- ${lon} -- ${pais}</p>`);
                    });
                } else {
                    alert('No se encontraron lugares con ese nombre.');
                }
            },
        });
    });
    //---------------------------------------Ciudades por nombre---------------------------------------
    $('#formCiudad').on('submit', function (event) {
        event.preventDefault();

        const nombreCiudad = $('#ciudad').val(); // Obtenemos el valor del campo de texto

        $.ajax({
            url: `http://api.openweathermap.org/geo/1.0/direct?q=${nombreCiudad}&limit=5&appid=${key}`,
            type: 'GET',
            success: function (respuesta) {
                // Limpiamos la tabla antes de añadir nuevos resultados
                $('#resultados').empty();

                if (respuesta.length > 0) {
                    // Mostramos la tabla
                    $('#result').show();

                    // Recorremos los resultados y los añadimos a la tabla
                    respuesta.forEach(function (lugar) {
                        // Limpiamos el combobox y lo mostramos
                        $('#ciudades').empty().show();
                        $('#ciudades').append('<option value="">Seleccione una ciudad</option>');

                        // Añadimos las ciudades al combobox
                        respuesta.forEach(function (lugar) {
                            const nombre = lugar.name;
                            const pais = lugar.country;
                            const lat = lugar.lat;
                            const lon = lugar.lon;

                            // Añade cada opción al combobox con lat y lon en los datos
                            $('#ciudades').append(`<option value="${lat},${lon}">${nombre} (${pais})</option>`);
                        });
                    });
                } else {
                    $('#ciudades').hide();
                    alert('No se encontraron lugares con ese nombre.');
                }
            },
        });
    });
    //---------------------------------------Cambio de ciudad en el combo---------------------------------------
    $('#ciudades').on('change', function() {
        const seleccion = $(this).val();
        if (seleccion) {
            const [lat, lon] = seleccion.split(',');
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`,
                type: 'GET',
                success: function(tiempo) {
                    const ciudad = tiempo.name;
                    const temperatura = tiempo.main.temp;
                    const descripcion = tiempo.weather[0].description;

                    // Mostramos la información del clima
                    $('#resultadoCiudad').html(`
                        <h3>Clima en ${ciudad}</h3>
                        <p>Temperatura: ${temperatura}°C</p>
                        <p>Descripción: ${descripcion}</p>
                    `);
                },
                error: function() {
                    alert("Hubo un error al obtener el clima.");
                }
            });
        } else {
            $('#resultadoCiudad').empty();
        }
    });

});
