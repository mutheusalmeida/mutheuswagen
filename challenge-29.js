(function($) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */
  
  var app = (function() {
    return {
      init: function init() {
        this.companyInfo();
        this.carInfo();
        this.initEvents();
      },
      
      initEvents: function initEvents() {
        $('[data-js="form-car"]').on('submit', this.handleSubmit);
      },
      
      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        
        var $tableCar = $('[data-js="table-car"]').get();
        
        while($tableCar.firstChild) {
          $tableCar.removeChild($tableCar.firstChild);
        }
        
        $tableCar.appendChild(app.createNewCar());
      },
      
      createNewCar: function createNewCar() {
        this.postCar();
        this.carInfo();
      },
      
      carInfo: function carInfo() {
        var ajax = new XMLHttpRequest();
        
        ajax.open('GET', 'http://localhost:3000/car', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCarInfo, false);
      },
      
      getCarInfo: function getCarInfo() {
        if(!app.isReady.call(this))
          return;
          
        var car = JSON.parse(this.responseText);
        
        car.forEach(getCarsFromData);
        
        function getCarsFromData(item) {
          var $tableCar = $('[data-js="table-car"]').get();
          var $fragment = document.createDocumentFragment();
        
          var $tr = document.createElement('tr');
          var $imageWrapper = document.createElement('td');
          var $image = document.createElement('img');
          var $model = document.createElement('td');
          var $year = document.createElement('td');
          var $plate = document.createElement('td');
          var $color = document.createElement('td');
          var $removeBtn = document.createElement('td');
        
          $image.src = item.image;
          $model.innerHTML = item.brandModel;
          $year.innerHTML = item.year;
          $plate.innerHTML = item.plate;
          $color.innerHTML = item.color;
          $removeBtn.innerHTML = '×';
          
          $tr.setAttribute('data-id', $plate.innerHTML);
          $removeBtn.setAttribute('data-id', $plate.innerHTML);
          
          $removeBtn.addEventListener('click', app.handleRemoveClick, false);
          
          $imageWrapper.appendChild($image);
          $tr.appendChild($imageWrapper);
          $tr.appendChild($model);
          $tr.appendChild($year);
          $tr.appendChild($plate);
          $tr.appendChild($color);
          $tr.appendChild($removeBtn);
          
          $fragment.appendChild($tr);
          
          return $tableCar.appendChild($fragment);
        }
      },
      
      handleRemoveClick: function handleRemoveClick(e) {
        var id = e.target.getAttribute('data-id');
        
        $(`[data-id="${id}"]`).get().remove();
        
        let ajax = new XMLHttpRequest();
        
        ajax.open('DELETE', 'http://localhost:3000/car', true);
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        ajax.send(`plate=${id}`);
        
        ajax.addEventListener('readystatechange', app.deletePlate, false);
      },
      
      deletePlate: function deletePlate() {
        if(!app.isReady.call(this))
          return;
      },
      
      postCar: function postCar() {
        var ajax = new XMLHttpRequest();
        
        ajax.open('POST', 'http://localhost:3000/car', true);
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        var $image = $('[data-js="image"]').get().value;
        var $model = $('[data-js="model"]').get().value;
        var $year = $('[data-js="year"]').get().value;
        var $plate = $('[data-js="plate"]').get().value;
        var $color = $('[data-js="color"]').get().value;
        
        
        ajax.send(`image=${$image}&brandModel=${$model}&year=${$year}&plate=${$plate}&color=${$color}`);
        
        ajax.addEventListener('readystatechange', this.postCarInfo, false);
      },
      
      postCarInfo: function postCarInfo() {
        if(!app.isReady.call(this))
          return;
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        
        ajax.open('GET', '/company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },
      
      getCompanyInfo: function getCompanyInfo() {
        if(!app.isReady.call(this))
          return;
        
        var data = JSON.parse(this.responseText);
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]').get();
        
        $companyName.innerHTML = data.name;
        $companyPhone.innerHTML = data.phone;
      },
      
      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      }
    };
  })();
  
  app.init();

})(window.DOM);
