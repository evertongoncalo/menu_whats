/* JS com tecnica de POO*/

$(document).ready(function () {
    menu.events.init();

})

var menu = {};

var MY_CART = [];

var MY_ADDRESS = null;

var TOTAL_PRICE = 0;

var SHIPPING = 5;

menu.events = {
    init: () => {
        menu.methods.obterItemsMenu();


    }

}

menu.methods = {
    //Pega a lista deitems do cardapio 
    obterItemsMenu: (category = 'burgers', seeMore=false) => {
        var filter = MENU[category];

        if (!seeMore){
            $('#menuItems').html('')
            $('#btn-seemore').removeClass('hidden')

        }

         //limpa o html pra add outros
        
        $.each(filter, (i, e) => {
            
            let temp = menu.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price)
            .replace(/\${id}/g, e.id)

            //paginar pro ver mais

            if (seeMore && i >= 8){ //mostra todos
                $('#menuItems').append(temp)
            }
            if (!seeMore && i < 8){ //mostra só 8
                $('#menuItems').append(temp)
            }

            
        })
        //remover class

        $(".container-menu a").removeClass('active')

        //colocar ative

        $('#menu-'+ category).addClass('active')

    },


    //Clicar no Seemore
    seeMore: () => {
        var active = $(".container-menu a.active").attr('id').split('menu-')[1]; //faz a consulta do que está ativo e pega o atributo do id

        menu.methods.obterItemsMenu(active,true)

        $('#btn-seemore').addClass('hidden')
    },
    //aumenta a quantidade do item no menu
    plusqty: (id) => {
        let totalQty = parseInt($("#qty-"+id).text());

       
        $("#qty-"+id).text(totalQty + 1);
       

        

    },
    //diminui a quantidade do item no menu
    minusqty: (id) => {
        let totalQty = parseInt($("#qty-"+id).text());

        if (totalQty > 0){
            $("#qty-"+id).text(totalQty - 1);
        }

    },

    addToCart: (id) => {

        let totalQty = parseInt($("#qty-"+id).text());

        if (totalQty > 0){

            //obter categoria
            var category = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obter lista dos items:
            let filter = MENU[category];

            //obter itemn:

            let item = $.grep(filter,(e,i) => {return e.id == id})

            if (item.length > 0){

                let exist = $.grep(MY_CART,(elem,index) => {return elem.id == id}) //filtra se existe ou nao

                if (exist.length > 0){
                    let objIndex = MY_CART.findIndex((obj => obj.id == id ))
                    MY_CART[objIndex].qty = MY_CART[objIndex].qty + totalQty
                }
                else {
                    item[0].qty = totalQty;
                    MY_CART.push(item[0])
                }

                $("#qty-"+id).text(0);

                
                
                menu.methods.updateBadge()
                menu.methods.message('Item added to cart', 'green')
            

                
                

            }

        }

    },

    //atualiza o totais dos botões do carrinho
    updateBadge: () => {

        var total = 0;

        $.each(MY_CART, (i, e) =>{
            total += e.qty 
        })

        if (total > 0){
            $(".btn-cart").removeClass('hidden')
            $(".container-total-cart").removeClass('hidden')
        }
        else {
            $(".btn-cart").addClass('hidden')
            $(".container-total-cart").addClass('hidden')
        }

        $('.badge-total-cart').html(total)

    },

    message: (text, color, time = 5000) => {  
        
        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `     
        <div id="msg-${id}" class="animated fadeInDown toast-${color}">
            ${text}
        </div>          
        `
        $('#container-messages').append(msg);

        setTimeout(() => {

            $('#msg-' + id).removeClass('fadeInDown')           
            $('#msg-' + id).addClass('fadeOutUp')           
            setTimeout(()=>{
                $('#msg-' + id).remove()

            }, 800)           

        }, time)
    },


    openCart: (open) => {
        if (open){
            $('#modal-cart').removeClass('hidden')
            menu.methods.loadCart()
        }
        else {
            $('#modal-cart').addClass('hidden')
        }

    },

    //change the texts and show the button steps
    loadStep: (step) => {        

        if (step == 1){
            

            $('#title-step').text('Your Cart:');
            $('#itemsCart').removeClass('hidden');
            $('#deliveryCart').addClass('hidden');
            $('#summary').addClass('hidden');

            //Steps

            $('.step').removeClass('active');
            $('.step-1').addClass('active');

            //Btns

            $('#btn-back').addClass('hidden')
            $('#btn-order-next').removeClass('hidden')
            $('#btn-order-address').addClass('hidden')
            $('#btn-order-send').addClass('hidden')


        }
        if (step == 2){

            
            $('#title-step').text('Delivery Address:');
            $('#itemsCart').addClass('hidden');
            $('#deliveryCart').removeClass('hidden');
            $('#summary').addClass('hidden');

            //Steps

            $('.step').removeClass('active');
            $('.step-1').addClass('active');
            $('.step-2').addClass('active');

            //Btns

            $('#btn-back').removeClass('hidden')
            $('#btn-order-next').addClass('hidden')
            $('#btn-order-address').removeClass('hidden')
            $('#btn-order-send').addClass('hidden')  

        }
        if (step == 3){

            $('#title-step').text('Summary:');
            $('#itemsCart').addClass('hidden');
            $('#deliveryCart').addClass('hidden');
            $('#summary').removeClass('hidden');

            //Steps

            $('.step').removeClass('active');
            $('.step-1').addClass('active');
            $('.step-2').addClass('active');
            $('.step-3').addClass('active');

            //Btns

            $('#btn-back').removeClass('hidden')
            $('#btn-order-next').addClass('hidden')
            $('#btn-order-address').addClass('hidden')
            $('#btn-order-send').removeClass('hidden')

        }
        

    },

    backStep: () => {
        let step = $(".step.active").length;
        menu.methods.loadStep(step -1);
    },


    loadCart: () => {
        menu.methods.loadStep(1);
    
        if (MY_CART.length > 0) {
            $('#itemsCart').html('');
    
            $.each(MY_CART, (i, e) => {
                let temp = menu.templates.itemCart
                    .replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${price}/g, e.price)
                    .replace(/\${id}/g, e.id)
                    .replace(/\${qty}/g, e.qty);
    
                $('#itemsCart').append(temp);


                if ((i+1) == MY_CART.length){
                    menu.methods.loadPrice();
                }
            });
        } else {
            $('#itemsCart').html('<p class="empty-cart"><i class="fa fa-shopping-bag"></i>The cart is empty</p>');
            menu.methods.loadPrice();
        }
    },
    

    minusqtyCart: (id) => {
        let totalQty = parseInt($("#qty-cart-"+id).text());

        if (totalQty > 1){
            $("#qty-cart-"+id).text(totalQty - 1);
            menu.methods.updateCart(id, totalQty - 1 )
        }
        else {
            menu.methods.removeItemCart(id)
        }

    },

    plusqtyCart: (id) => {

        let totalQty = parseInt($("#qty-cart-"+id).text());

       
        $("#qty-cart-"+id).text(totalQty + 1);
        menu.methods.updateCart(id, totalQty + 1 )

    },
    //button remocve item on the cart
    removeItemCart: (id) =>{

        MY_CART = $.grep(MY_CART, (e,i) =>{return e.id != id;})
        menu.methods.loadCart();
        menu.methods.updateBadge();


    },

    updateCart: (id, qty) => {
        let objIndex = MY_CART.findIndex((obj => obj.id == id));
        MY_CART[objIndex].qty = qty;
        menu.methods.updateBadge();
        menu.methods.loadPrice();
    }, 
     

    loadPrice: () => {
        TOTAL_PRICE = 0;

        $('#subtotal').text('€ 0.00');
        $('#delivery-costs').text('+ € 0.00');
        $('#total').text('€ 0.00');

        $.each(MY_CART, (i,e) => {

            TOTAL_PRICE += parseFloat(e.price * e.qty);

            if ((i + 1) == MY_CART.length){
                $('#subtotal').text(`€ ${TOTAL_PRICE}`);
                $('#delivery-costs').text(`+ € ${SHIPPING}`);
                $('#total').text(`€ ${TOTAL_PRICE + SHIPPING}`);
            }


        })

    },
    //load the address steps
    loadAddress: () => {

        if (MY_CART.length > 0) {
            menu.methods.loadStep(2)

        }
        else {
            menu.methods.message('Your cart is empty', 'red')
            return;
        }


    },

    searchPostcode: () => {

        //variavel com valor do codigo postal
        var postcode = $('#postcode').val().trim().replace(/\D/g,"")

        //verifica se tem valr informado
        if (postcode != ""){
            var postcodeValidation = /^[0-9]{8}$/; //usando regex

            if (postcodeValidation.test(postcode)){
                $.getJSON('https://viacep.com.br/ws/' + postcode + '/json/?callback=?',function (data){
                    if (!('erro' in data)){

                        //atualizar os campo com valores retonados
                        $('#address').val(data.logradouro);
                        $('#state').val(data.localidade);
                        $('#city').val(data.uf);
                        $('#country').val(data.bairro);
                        $('#number').focus(); //foca no input



                    }
                    else {
                        menu.methods.message("postcode not find, fill your information manually", 'red');
                        $('#address').focus();
                    }
                })

            }
            else {
                menu.methods.message("Invalid postcode", 'red');
                $('#postcode').focus();
            }

        }
        else {
            menu.methods.message("inform your postcode", 'red');
            $('#postcode').focus();
        }

    },

    //validation befor to go to 3 step
    summaryOrder: () => {

        let postcode = $('#postcode').val().trim();
        let address = $('#address').val().trim();
        let state = $('#state').val().trim();
        let city = $('#city').val().trim();
        let country = $('#country').val().trim();
        let number = $('#number').val().trim(); 

        if (postcode.length <= 0){
            menu.methods.message('informe your postcode please')
            $('#postcode').focus();
            return;
        }
        if (address.length <= 0){
            menu.methods.message('informe your address please')
            $('#address').focus();
            return;
        }
        if (state.length <= 0){
            menu.methods.message('informe your state please')
            $('#state').focus();
            return;
        }
        if (city.length <= 0){
            menu.methods.message('informe your city please')
            $('#city').focus();
            return;
        }
        if (country.length <= 0){
            menu.methods.message('informe your country please')
            $('#country').focus();
            return;
        }
        if (number.length <= 0){
            menu.methods.message('informe your number please')
            $('#number').focus();
            return;
        }

        MY_ADDRESS = {
            postcode : postcode,
            address : address,
            state : state,
            city : city,
            country : country,
            number : number
            
        }

        menu.methods.loadStep(3);



    },




}
menu.templates = {

    item: 
        `     
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-product">
                    <img src="\${img}"
                        alt="">
                </div>
                <p class="title-product mt-4">\${name}</p>
                <p class="price-product">€\${price}</p>
                <div class="add-to-cart">
                    <span class="btn-minus" onclick="menu.methods.minusqty('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-items" id="qty-\${id}">0</span>
                    <span class="btn-plus" onclick="menu.methods.plusqty('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="menu.methods.addToCart('\${id}')"><i class="fa fa-shopping-bag"></i></span>

                </div>
            </div>
        </div>          
        `
        ,

    itemCart: 
        `
        <div class="col-12 cart-item">
            <div class="img-prod">
                <img src="\${img}"
                    alt="">
            </div>
            <div class="info-prod">
                <p class="title-product"><b>\${name}</b></p>
                <p class="price-product"><b>€\${price}</b></p>
            </div>
            <div class="add-to-cart">
                <span class="btn-minus" onclick="menu.methods.minusqtyCart('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-items" id="qty-cart-\${id}">\${qty}</span>
                <span class="btn-plus" onclick="menu.methods.plusqtyCart('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="menu.methods.removeItemCart('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
        `

}