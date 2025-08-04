$(document).ready(function () {
    const SEUIL_RISQUE = 10000000; // 10M FCFA
    let operations = [];
    let alertes = [];

    // Charger les opérations
   
   function chargerOperations() {
    $.getJSON('operations.json', function (data) {
        const operations = data.filter(op => op.client && op.date);
        const alertes = operations.filter(op => op.risque === true || op.montant > SEUIL_RISQUE);

        // Mettre à jour les statistiques visibles
        $('#nb-operations').text(operations.length);
        $('#nb-alertes').text(alertes.length);

        afficherGraphiqueOperations(operations, alertes);
    });
}

    // Affichage des alertes sous forme de liste
    function afficherAlertes() {
        const listeAlertes = $('#listeAlertes');
        listeAlertes.empty();

        if (alertes.length === 0) {
            listeAlertes.append('<li>Aucune opération à risque détectée.</li>');
        } else {
            alertes.forEach(op => {
                const item = `<li>
                    Client : <strong>${op.client}</strong> - Montant : 
                    <strong>${op.montant.toLocaleString()} FCFA</strong> - 
                    Risque : ${op.risque ? 'Oui' : 'Non'} - 
                    Date : ${op.date}
                </li>`;
                listeAlertes.append(item);
            });
        }
    }

   function afficherGraphiqueOperations(operations, alertes) {
        const ctx = document.getElementById('graphiqueOperations').getContext('2d');

        // Comptage global
        const nbOperations = operations.length;
        const nbAlertes = alertes.length;

        // Créer un graphique en barres avec 2 colonnes
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Opérations totales', 'Opérations à risque'],
                datasets: [{
                    label: 'Nombre',
                    data: [nbOperations, nbAlertes],
                    backgroundColor: ['#4CAF50', '#F44336']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        precision: 0
                    }
                }
            }
        });
    }

    $.getJSON('clients.json', function(data) {
        const risques = {
            "faible": 0,
            "moyen": 0,
            "élevé": 0
        };

        data.forEach(client => {
            const risque = client.risque.toLowerCase();
            if (risques[risque] !== undefined) {
                risques[risque]++;
            }
        });

        const ctx = document.getElementById('profilageChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Faible', 'Moyen', 'Élevé'],
                datasets: [{
                    label: 'Répartition des niveaux de risque',
                    data: [risques.faible, risques.moyen, risques.élevé],
                    backgroundColor: ['#8FCB9B', '#FFD700', '#FF6347']
                }]
            },
            options: {
                responsive: true
            }
        });
    });


    let comptes = [];
     function filtrerCompte() {
    const clientFiltre = $('#filtreClientCompte').val().toLowerCase();
    const compteFiltre = $('#filtreCompte').val().toLowerCase();
    const soldeFiltre = $('#filtreSolde').val();
    const etatFiltre = $('#filtreEtat').val().toLowerCase();

    const filtered = comptes.filter(c => {
        const clientMatch = !clientFiltre || (c.client && c.client.toLowerCase().includes(clientFiltre));
        const compteMatch = !compteFiltre || (c.compte && c.compte.toLowerCase().includes(compteFiltre));
        const soldeMatch = !soldeFiltre || c.solde >= parseFloat(soldeFiltre);
        const etatMatch = !etatFiltre || (c.etat && c.etat.toLowerCase() === etatFiltre);

        return clientMatch && compteMatch && soldeMatch && etatMatch;
    });

    afficherComptes(filtered);
}
$('#btnFiltrer').click(filtrerCompte); // Doit être dehors, tout en bas


    function afficherGraphiqueComptes(comptes) {
    // Compter le nombre de comptes par état
    const stats = comptes.reduce((acc, compte) => {
        if (compte.etat === 'Découvert') {
            acc.decouvert++;
        } else {
            acc.sain++;
        }
        return acc;
    }, { sain: 0, decouvert: 0 });

    const ctx = document.getElementById('comptesChart').getContext('2d');

    // Créer le graphique camembert
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Normal', 'Découvert'],
            datasets: [{
                label: 'Répartition des comptes',
                data: [stats.sain, stats.decouvert],
                backgroundColor: ['#4CAF50', '#F44336'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}


    function chargerComptes() {
    $.getJSON("comptes.json", function (data) {
        comptes = data; // stocker globalement
        $('#nb-comptes').text(data.length);
        afficherComptes(data);
        afficherGraphiqueComptes(data);
    });
}


    function afficherComptes(comptes) {
        const tbody = $('#tableComptes tbody');
        tbody.empty();

        comptes.forEach(cpt => {
            const row = `<tr>
                <td>${cpt.client}</td>
                <td>${cpt.compte}</td>
                <td>${cpt.type}</td>
                <td>${parseFloat(cpt.solde).toLocaleString()} FCFA</td>
                <td>${cpt.dernier_mouvement}</td>
                <td class="${cpt.etat === 'Découvert' ? 'alerte' : ''}">${cpt.etat}</td>
                <td class="cell-actions">
                    <button class="btn-supprimer-compte">Supprimer</button>
                </td>
            </tr>`;
            tbody.append(row);
        });
    }

    // Formulaire : afficher/masquer
    $('#btnAfficherFormAjoutCompte').click(function () {
        $('#formAjoutCompte').slideToggle();
    });

    // Ajouter un compte
    $('#formAjoutCompte').submit(function (e) {
        e.preventDefault();

        const nouveauCompte = {
            client: $('#ajoutClient').val(), 
            compte: $('#ajoutCompte').val(),
            type: $('#ajoutType').val(),
            solde: parseFloat($('#ajoutSolde').val()),
            dernier_mouvement: $('#ajoutDernierMouvement').val(),
            etat: $('#ajoutEtat').val()
        };


        const ligne = `<tr>
            <td>${nouveauCompte.client }</td>   
            <td>${nouveauCompte.compte}</td>
            <td>${nouveauCompte.type}</td>
            <td>${nouveauCompte.solde.toLocaleString()} FCFA</td>
            <td>${nouveauCompte.dernier_mouvement}</td>
            <td class="${nouveauCompte.etat === 'Découvert' ? 'alerte' : ''}">${nouveauCompte.etat}</td>
            <td class="cell-actions">
                <button class="btn-supprimer-compte">Supprimer</button>
            </td>
        </tr>`;

        $('#tableComptes tbody').append(ligne);
        $('#formAjoutCompte')[0].reset();
        $('#formAjoutCompte').slideUp();
    });

    // Annuler ajout
    $('#annulerAjoutCompte').click(function () {
        $('#formAjoutCompte')[0].reset();
        $('#formAjoutCompte').slideUp();
    });

    // Supprimer un compte
    $('#tableComptes').on('click', '.btn-supprimer-compte', function () {
        $(this).closest('tr').remove();
    });

    // Lancement
    chargerOperations();
    chargerComptes();
});
