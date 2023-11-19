/* JS com tecnica de POO*/

$(document).ready(function () {
    menu.events.init();

})

var menu = {};

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
            .replace(/\${price}/g, e.price);

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
    }

}
menu.templates = {

    item: 
        `     
        <div class="col-3 mb-5">
            <div class="card card-item">
                <div class="img-product">
                    <img src="\${img}"
                        alt="">
                </div>
                <p class="title-product mt-4">\${name}</p>
                <p class="price-product">€\${price}</p>
                <div class="add-to-cart">
                    <span class="btn-minus"><i class="fas fa-minus"></i></span>
                    <span class="add-items">0</span>
                    <span class="btn-plus"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>

                </div>
            </div>
        </div>          
        `

}