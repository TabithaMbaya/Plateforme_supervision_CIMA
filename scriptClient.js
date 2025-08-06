$(document).ready(function () {
    const SEUIL_RISQUE = 10000000;
    let clients = [];

    function chargerClients() {
        $.getJSON('clients.json', function(data) {
            clients = data;
            afficherClients(clients);
        }).fail(function() {
            alert('Erreur de chargement du fichier clients.json');
        });
    }

    function afficherClients(clients) {
        const liste = $('#listeClients');
        if (!liste.length) return;
        liste.empty();

        if (clients.length === 0) {
            liste.append('<li>Aucun client trouvé.</li>');
            return;
        }

        clients.forEach((c, index) => {
            const item = $(`
                <li class="client-item">
                    <strong>${c.nom}</strong><br>
                    Type : ${c.type} <br>
                    Produit : ${c.produit} <br>
                    Risque : <span class="risque-${c.risque.toLowerCase()}">${c.risque}</span>
                    <button class="btn-modifier" data-index="${index}">🖋</button>
                    <button class="btn-supprimer" data-index="${index}" title="Supprimer">🗑️</button>
                </li>
            `);
            liste.append(item);
        });

        $('.btn-modifier').off('click').on('click', function () {
            const index = $(this).data('index');
            const client = clients[index];

            $('#formClient').hide();
            $('#afficherFormAjout').show();
            $('.form-modification-dynamique').remove();

            const formModif = $(`
                <form class="form-modification-dynamique">
                    <input type="hidden" class="modifIndex" value="${index}">
                    <label>Nom :
                        <input type="text" class="modifNom" value="${client.nom}" required>
                    </label>
                    <label>Type :
                        <select class="modifType">
                            <option value="particulier" ${client.type === 'particulier' ? 'selected' : ''}>Particulier</option>
                            <option value="entreprise" ${client.type === 'entreprise' ? 'selected' : ''}>Entreprise</option>
                        </select>
                    </label>
                    <label>Produit :
                        <select class="modifProduit">
                            <option value="auto" ${client.produit === 'auto' ? 'selected' : ''}>Auto</option>
                            <option value="vie" ${client.produit === 'vie' ? 'selected' : ''}>Vie</option>
                            <option value="santé" ${client.produit === 'santé' ? 'selected' : ''}>Santé</option>
                        </select>
                    </label>
                    <label>Risque :
                        <select class="modifRisque">
                            <option value="faible" ${client.risque === 'faible' ? 'selected' : ''}>Faible</option>
                            <option value="moyen" ${client.risque === 'moyen' ? 'selected' : ''}>Moyen</option>
                            <option value="élevé" ${client.risque === 'élevé' ? 'selected' : ''}>Élevé</option>
                        </select>
                    </label>
                    <button type="submit" class="btn-enregistrer-modif">Enregistrer</button>
                    <button type="button" class="btn-annuler-modif">Annuler</button>
                </form>
            `);

            $(this).closest('li').after(formModif.hide().slideDown());

            formModif.on('submit', function (e) {
                e.preventDefault();
                clients[index] = {
                    nom: formModif.find('.modifNom').val(),
                    type: formModif.find('.modifType').val(),
                    produit: formModif.find('.modifProduit').val(),
                    risque: formModif.find('.modifRisque').val()
                };
                afficherClients(clients);
            });

            formModif.find('.btn-annuler-modif').on('click', function () {
                formModif.slideUp(() => formModif.remove());
            });
        });

        $('.btn-supprimer').off('click').on('click', function () {
            const i = $(this).data('index');
            if (confirm(`Supprimer le client "${clients[i].nom}" ?`)) {
                clients.splice(i, 1);
                afficherClients(clients);
            }
        });
    }

    function filtrerClients() {
        const typeFiltre = $('#filtreTypeClient').val();
        const produitFiltre = $('#filtreProduit').val();
        const risqueFiltre = $('#filtreRisqueClient').val();

        const filtered = clients.filter(c => {
            if (typeFiltre && c.type !== typeFiltre) return false;
            if (produitFiltre && c.produit !== produitFiltre) return false;
            if (risqueFiltre && c.risque !== risqueFiltre) return false;
            return true;
        });

        afficherClients(filtered);
    }

    

    $('#formClient').hide();
    $('#afficherFormAjout').on('click', () => {
        $('#formClient').slideDown();
        $('#afficherFormAjout').hide();
    });
    $('#annulerAjout').on('click', () => {
        $('#formClient').slideUp();
        $('#afficherFormAjout').show();
    });

    $('#formClient').on('submit', function (e) {
        e.preventDefault();
        const nouveauClient = {
            nom: $('#ClientNom').val(),
            type: $('#ClientType').val(),
            produit: $('#ClientProduit').val(),
            risque: $('#ClientRisque').val() || 'moyen'
        };
        if (!nouveauClient.nom) {
            alert("Le nom est requis.");
            return;
        }
        clients.push(nouveauClient);
        afficherClients(clients);
        this.reset();
        $('#formClient').slideUp();
        $('#afficherFormAjout').show();
    });

    $('#btnFiltrerClients').on('click', filtrerClients);

    // Lancer chargement
    chargerClients();
});
