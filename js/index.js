jQuery(document).ready(function () {
    const key = '6f899d4fb1f91461bd6cae8c9958aaa5';
   
    dailyData = {};  
    $('#homePage').on('click', function (event) {
        event.preventDefault();
        $('#bodyPagina').empty();
        $('#bodyPagina').append(`
                <header class="bg-primary text-white text-center py-5">
      <div class="container">
      <h1 class="display-4">¡Conoce el Clima en Tiempo Real!</h1>
      <p class="lead">Consulta el estado del clima actual y obtén predicciones precisas de cualquier ciudad del mundo.</p>
      </div>
  </header>
  <section class="py-5">
      <div class="container text-center">
      <h2 class="mb-4">¿Qué Ofrecemos?</h2>
      <div class="row">
          <div class="col-md-4">
          <i class="bi bi-geo-alt fs-1 text-primary"></i>
          <h4 class="mt-3">Clima Actual</h4>
          <p>Consulta el clima en tiempo real según tu ubicación.</p>
          </div>
          <div class="col-md-4">
          <i class="bi bi-cloud-sun fs-1 text-primary"></i>
          <h4 class="mt-3">Predicciones</h4>
          <p>Obtén predicciones precisas para los próximos días.</p>
          </div>
          <div class="col-md-4">
          <i class="bi bi-search fs-1 text-primary"></i>
          <h4 class="mt-3">Busca Ciudades</h4>
          <p>Encuentra el estado del clima en cualquier ciudad del mundo.</p>
          </div>
      </div>
      </div>
  </section>
  <footer class="bg-primary text-white text-center py-3">
      <div class="container">
      <p>&copy; 2024 Weather is Wet. Todos los derechos reservados.</p>
      </div>
  </footer>

    `);


    });
    //---------------------------------------Página Localización actual---------------------------------------
    $('#ciudadActPage').on('click', function (event) {
        lat = "";
        lon = "";
        navigator.geolocation.getCurrentPosition(geolocalizacionPermitida);
        function geolocalizacionPermitida(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
        };    
        event.preventDefault();
        $('#bodyPagina').empty();
        $('#bodyPagina').append(`    
                <div class="container mt-3">
      <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="container mt-5">
              <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" name="btnGroupRadio" id="tiempoAct" autocomplete="off"
                    checked="">
                <label class="btn btn-outline-primary" for="tiempoAct">Tiempo Actual</label>
                <input type="radio" class="btn-check" name="btnGroupRadio" id="prediccion" autocomplete="off">
                <label class="btn btn-outline-primary" for="prediccion">Predicción para los próximos 4 días</label>
              </div>  
            </div>
          </div>
        </div>
      </div>
  </div>

            <div id="tiempoCiudadAct"></div>
        `);
        $('#prediccion').on('click', function (event) {
            $('#tablaResultados').empty();
            $('#tablaResultados').append(  `
            <div class="container mt-5">
                <h1 class="text-center">5 Day / 3 Hour Weather Forecast</h1>
                <table class="table table-bordered table-hover mt-4">
                    <thead class="thead-dark">
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Temperature (°C)</th>
                            <th>Weather</th>
                            <th>Wind Speed (m/s)</th>
                        </tr>
                    </thead>
                    <tbody id="climaBody">
                        
                    </tbody>
                </table>
            </div>
              <div id="tipoPrediccion">

`);
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`,
                type: 'GET',
                success: function (data) {
                    // Vaciar cualquier contenido previo en la tabla
                    $('#prediccionBody').empty();
    
                    if (data && data.list) {
                        // Mostrar la tabla
                        $('#prediccionClima').show();
                        dailyData = {};
                        // Recorrer los datos para agrupar por día
                        data.list.forEach(item => {
                            const fecha = new Date(item.dt * 1000).toLocaleDateString();
                            const temp = item.main.temp;
                            const humedad = item.main.humidity;
                            const descripcion = item.weather[0].description;
    
                            // Si no existe un registro para el día, lo creamos
                            if (!dailyData[fecha]) {
                                dailyData[fecha] = {
                                    maxTemp: temp,
                                    minTemp: temp,
                                    humedad: humedad,
                                    descripcion: descripcion,
                                };
                            } else {
                                // Actualizamos los valores máximos y mínimos
                                dailyData[fecha].maxTemp = Math.max(dailyData[fecha].maxTemp, temp);
                                dailyData[fecha].minTemp = Math.min(dailyData[fecha].minTemp, temp);
                                dailyData[fecha].humedad = (dailyData[fecha].humedad + humedad) / 2; // Promedio
                            }
                        });
    
                        // Iterar sobre los datos diarios y crear filas en la tabla
                        Object.keys(dailyData).forEach(fecha => {
                            const fila = `
                                <tr>
                                    <td>${fecha}</td>
                                    <td>${dailyData[fecha].maxTemp.toFixed(1)}</td>
                                    <td>${dailyData[fecha].minTemp.toFixed(1)}</td>
                                    <td>${dailyData[fecha].humedad.toFixed(1)}</td>
                                    <td>${dailyData[fecha].descripcion}</td>
                                </tr>
                            `;
                            $('#climaBody').append(fila);
                        });
                    } else {
                        alert('No se encontraron datos de predicción.');
                    }
                },
            });
        });
        $('#tiempoAct').on('click', function (event) {
            $('#tablaResultados').empty();
            $('#tablaResultados').append( `
            <div class="container mt-4">
                <div id="climaActual" class="mt-4" style="display:none;">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Ciudad</th>
                                <th>Temperatura Actual (°C)</th>
                                <th>Temperatura Máxima (°C)</th>
                                <th>Temperatura Mínima (°C)</th>
                                <th>Humedad (%)</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody id="climaBody">
                            
                        </tbody>
                    </table>
                </div>
            </div>
            `);
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`,
                type: 'GET',
                success: function (data) {
                    // Vaciar cualquier contenido previo en la tabla
                    $('#climaBody').empty();
                    if (data) {
                        // Mostrar la tabla
                        $('#climaActual').show();
    
                        const ciudad = data.name;
                        const tempActual = data.main.temp.toFixed(1);
                        const tempMax = data.main.temp_max.toFixed(1);
                        const tempMin = data.main.temp_min.toFixed(1);
                        const humedad = data.main.humidity;
                        const descripcion = data.weather[0].description;
    
                        // Crear una fila con los datos
                        const fila = `
                            <tr>
                                <td>${ciudad}</td>
                                <td>${tempActual}</td>
                                <td>${tempMax}</td>
                                <td>${tempMin}</td>
                                <td>${humedad}</td>
                                <td>${descripcion}</td>
                            </tr>
                        `;
                        // Agregar la fila al tbody
                        $('#climaBody').append(fila);
                    } else {
                        alert('No se encontraron datos de clima actual.');
                    }
                },
            });
        });
    });

    //---------------------------------------Página a Buscar Ciudad---------------------------------------
    $('#buscarCiudadPage').on('click', function (event) {
        lat = "";
        lon = "";
        event.preventDefault();
        $('#bodyPagina').empty();
        $('#bodyPagina').append(`    
            <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <form id="formCiudad">
                            <label>Nombre de la Ciudad</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-map"></i></span>
                                <input type="text" class="form-control" id="ciudad" placeholder="Introduce la ciudad" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="container mt-3">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <select class="form-select" id="ciudades" style="display: none;">
                            <option value="">Seleccione una ciudad</option>
                        </select>
                        <div id="resultadoCiudad"></div>
                    </div>
                </div>
            </div>
                          <div id="tipoPrediccion">
            <div class="container mt-3">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="container mt-5">
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" name="btnGroupRadio" id="tiempoAct" autocomplete="off"
                            checked="">
                        <label class="btn btn-outline-primary" for="tiempoAct">Tiempo Actual</label>
                        <input type="radio" class="btn-check" name="btnGroupRadio" id="prediccion" autocomplete="off">
                        <label class="btn btn-outline-primary" for="prediccion">Predicción para los próximos 4 días</label>
                    </div>  
                    </div>
                </div>
                </div>
            </div>
        </div>

        `);
        //---------------------------------------Ciudades por nombre---------------------------------------
        $('#formCiudad').on('submit', function (event) {
            event.preventDefault();
            const nombreCiudad = $('#ciudad').val(); // Obtenemos el valor del campo de texto
            $.ajax({
                url: `http://api.openweathermap.org/geo/1.0/direct?q=${nombreCiudad}&limit=5&appid=${key}`,
                type: 'GET',
                success: function (respuesta) {
                    if (respuesta.length > 0) {
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
        $('#ciudades').on('change', function () {
            const seleccion = $(this).val();
            const [lat, lon] = seleccion.split(',');
            $('#prediccion').on('click', function (event) {
                $('#tablaResultados').empty();
                $('#tablaResultados').append(  `
                <div class="container mt-5">
                    <h1 class="text-center">5 Day / 3 Hour Weather Forecast</h1>
                    <table class="table table-bordered table-hover mt-4">
                        <thead class="thead-dark">
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Temperatura (°C)</th>
                                <th>Tiempo</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody id="climaBody">
                            <!-- Rows will be added dynamically -->
                        </tbody>
                    </table>
                </div>`);
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`,
                    type: 'GET',
                    success: function (data) {
                        // Vaciar cualquier contenido previo en la tabla
                        $('#prediccionBody').empty();
                        if (data && data.list) {
                            $('#prediccionClima').show();
                            dailyData = {};
                            data.list.forEach(item => {
                                const fecha = new Date(item.dt * 1000).toLocaleDateString();
                                const temp = item.main.temp;
                                const humedad = item.main.humidity;
                                const descripcion = item.weather[0].description;
        
                                // Si no existe un registro para el día, lo creamos
                                if (!dailyData[fecha]) {
                                    dailyData[fecha] = {
                                        maxTemp: temp,
                                        minTemp: temp,
                                        humedad: humedad,
                                        descripcion: descripcion,
                                    };
                                } else {
                                    dailyData[fecha].maxTemp = Math.max(dailyData[fecha].maxTemp, temp);
                                    dailyData[fecha].minTemp = Math.min(dailyData[fecha].minTemp, temp);
                                    dailyData[fecha].humedad = (dailyData[fecha].humedad + humedad) / 2; // Promedio
                                }
                            });
                            // Iterar sobre los datos diarios y crear filas en la tabla
                            Object.keys(dailyData).forEach(fecha => {
                                const fila = `
                                    <tr>
                                        <td>${fecha}</td>
                                        <td>${dailyData[fecha].maxTemp.toFixed(1)}</td>
                                        <td>${dailyData[fecha].minTemp.toFixed(1)}</td>
                                        <td>${dailyData[fecha].humedad.toFixed(1)}</td>
                                        <td>${dailyData[fecha].descripcion}</td>
                                    </tr>
                                `;
                                $('#climaBody').append(fila);
                            });
                        } else {
                            alert('No se encontraron datos de predicción.');
                        }
                    },
                });
            });
            $('#tiempoAct').on('click', function (event) {
                $('#tablaResultados').empty();
                $('#tablaResultados').append( `
                <div class="container mt-4">
                    <div id="climaActual" class="mt-4" style="display:none;">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ciudad</th>
                                    <th>Temperatura Actual (°C)</th>
                                    <th>Temperatura Máxima (°C)</th>
                                    <th>Temperatura Mínima (°C)</th>
                                    <th>Humedad (%)</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody id="climaBody">
                                <!-- Filas dinámicas -->
                            </tbody>
                        </table>
                    </div>
                </div>
                `);
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`,
                    type: 'GET',
                    success: function (data) {
                        // Vaciar cualquier contenido previo en la tabla
                        $('#climaBody').empty();
        
                        if (data) {
                            // Mostrar la tabla
                            $('#climaActual').show();
        
                            const ciudad = data.name;
                            const tempActual = data.main.temp.toFixed(1);
                            const tempMax = data.main.temp_max.toFixed(1);
                            const tempMin = data.main.temp_min.toFixed(1);
                            const humedad = data.main.humidity;
                            const descripcion = data.weather[0].description;
        
                            // Crear una fila con los datos
                            const fila = `
                                <tr>
                                    <td>${ciudad}</td>
                                    <td>${tempActual}</td>
                                    <td>${tempMax}</td>
                                    <td>${tempMin}</td>
                                    <td>${humedad}</td>
                                    <td>${descripcion}</td>
                                </tr>
                            `;
                            // Agregar la fila al tbody
                            $('#climaBody').append(fila);
                        } else {
                            alert('No se encontraron datos de clima actual.');
                        }
                    }                });
            });
        });
    });

});