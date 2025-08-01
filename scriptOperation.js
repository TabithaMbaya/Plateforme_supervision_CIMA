$(document).ready(function () {
    const SEUIL_RISQUE = 10000000; // 10M FCFA
    let operations = [];
    let alertes = [];

    // Charger opérations depuis operations.json
    function chargerOperations() {
        return $.getJSON('operations.json', function(data) {
            operations = data.filter(op => op.client && op.date);
            alertes = operations.filter(op => op.risque === true || op.montant > SEUIL_RISQUE);
        }).fail(function() {
            alert('Erreur de chargement du fichier operations.json');
        });
    }

    // Afficher les opérations dans le tableau
    function afficherOperations(ops = operations) {
        const tbody = $('#tableOperations tbody');
        if (!tbody.length) return;
        tbody.empty();

        if (ops.length === 0) {
            tbody.append('<tr><td colspan="7">Aucune opération trouvée</td></tr>');
            return;
        }

        ops.forEach(op => {
            const trClass = (op.risque === true || op.montant > SEUIL_RISQUE) ? 'suspect' : '';
            tbody.append(`
                <tr class="${trClass}">
                    <td>${op.id}</td>
                    <td>${op.date}</td>
                    <td>${op.client}</td>
                    <td>${Number(op.montant).toLocaleString('fr-FR')} FCFA</td>
                    <td>${op.type || ''}</td>
                    <td>${op.risque ? 'élevé' : 'faible'}</td>
                    <td>${op.commentaire || ''}</td>
                    <td class="cell-actions">
                        <button class="btn-modifier">Modifier</button>
                        <button class="btn-supprimer">Supprimer</button>
                    </td>
                </tr>
            `);
        });
    }

    // Afficher les alertes
    function afficherAlertes() {
        const tbody = $('#tableAlertes tbody');
        if (!tbody.length) return;
        tbody.empty();

        if (alertes.length === 0) {
            tbody.append('<tr><td colspan="7">Aucune opération suspecte.</td></tr>');
            return;
        }

        alertes.forEach(op => {
            tbody.append(`
                <tr class="suspect">
                    <td>${op.id}</td>
                    <td>${op.date}</td>
                    <td>${op.client}</td>
                    <td>${Number(op.montant).toLocaleString('fr-FR')} FCFA</td>
                    <td>${op.type || ''}</td>
                    <td>élevé</td>
                    <td>${op.commentaire || ''}</td>
                </tr>
            `);
        });
    }

    // Exporter les alertes en JSON
    function exporterAlertes() {
        if (alertes.length === 0) {
            alert('Aucune alerte à exporter.');
            return;
        }

        const jsonStr = JSON.stringify(alertes, null, 2);
        const blob = new Blob([jsonStr], {type: "application/json"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `alertes_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Charger comptes depuis comptes.json
    function chargerComptes() {
        $.getJSON("comptes.json", function(data) {
            const tbody = $("#tableComptes tbody");
            if (!tbody.length) return;
            tbody.empty();

            data.forEach(compte => {
                const row = `<tr>
                    <td>${compte.compte}</td>
                    <td>${compte.type}</td>
                    <td>${compte.solde.toLocaleString()} FCFA</td>
                    <td>${compte.dernier_mouvement}</td>
                    <td class="${compte.etat === 'Découvert' ? 'alerte' : ''}">${compte.etat}</td>
                </tr>`;
                tbody.append(row);
            });
        });
    }

    $('#btnAfficherFormAjout').click(function () {
        $('#formAjoutOperation').slideToggle();
    });

    $('#formAjoutOperation').submit(function (e) {
        e.preventDefault();

        const nouvelleOperation = {
            id: Date.now(),
            date: $('#ajoutDate').val(),
            client: $('#ajoutClient').val(),
            montant: parseFloat($('#ajoutMontant').val()),
            type: $('#ajoutType').val(),
            risque: $('#ajoutRisque').val() === 'true',
            commentaire: $('#ajoutCommentaire').val()
        };

        const ligne = `
            <tr>
                <td>${nouvelleOperation.id}</td>
                <td>${nouvelleOperation.date}</td>
                <td>${nouvelleOperation.client}</td>
                <td>${nouvelleOperation.montant}</td>
                <td>${nouvelleOperation.type}</td>
                <td>${nouvelleOperation.risque ? 'Élevé' : 'Faible'}</td>
                <td>${nouvelleOperation.commentaire}</td>
                <td class="cell-actions">
                    <button class="btn-modifier">Modifier</button>
                    <button class="btn-supprimer">Supprimer</button>
                </td>
            </tr>
        `;

        $('#tableOperations tbody').append(ligne);
        $('#formAjoutOperation')[0].reset();
        $('#formAjoutOperation').slideUp();
    });

    $('#annulerAjout').click(function () {
        $('#formAjoutOperation')[0].reset();
        $('#formAjoutOperation').slideUp();
    });

    $('#annulerModif').click(function () {
    $('#formModifierOperation')[0].reset();
    $('#formModifierOperation').slideUp();
});


    // Suppression d’une ligne (délégation d’événement)
    $('#tableOperations').on('click', '.btn-supprimer', function () {
    const id = $(this).closest('tr').find('td:first').text();
    operations = operations.filter(op => op.id != id); // Mise à jour du tableau
    $(this).closest('tr').remove();
});


    // Exemple basique pour modifier (à améliorer si besoin)
    $('#tableOperations').on('click', '.btn-modifier', function () {
    const tr = $(this).closest('tr');
    const id = tr.find('td:eq(0)').text();
    const op = operations.find(o => o.id == id);

    if (!op) return;

    $('#modifId').val(op.id);
    $('#modifDate').val(op.date);
    $('#modifClient').val(op.client);
    $('#modifMontant').val(op.montant);
    $('#modifType').val(op.type);
    $('#modifRisque').val(op.risque ? 'true' : 'false');
    $('#modifCommentaire').val(op.commentaire);

    $('#formModifierOperation').slideDown();
});


$('#formModifierOperation').submit(function (e) {
    e.preventDefault();

    const id = $('#modifId').val();
    const index = operations.findIndex(o => o.id == id);
    if (index === -1) return;

    operations[index] = {
        id: Number(id),
        date: $('#modifDate').val(),
        client: $('#modifClient').val(),
        montant: parseFloat($('#modifMontant').val()),
        type: $('#modifType').val(),
        risque: $('#modifRisque').val() === 'true',
        commentaire: $('#modifCommentaire').val()
    };

    afficherOperations(); // rafraîchir le tableau
    $('#formModifierOperation')[0].reset();
    $('#formModifierOperation').slideUp();
});



    // Filtrage des opérations
    function filtrerOperations() {
        const dateFiltre = $('#filtreDate').val();
        const montantMin = Number($('#filtreMontant').val()) || 0;
        const clientFiltre = $('#filtreClient').val()?.toLowerCase() || '';
        const risqueFiltre = $('#filtreRisque').val();

        const filtered = operations.filter(op => {
            if (dateFiltre && op.date !== dateFiltre) return false;
            if (op.montant < montantMin) return false;
            if (clientFiltre && !op.client.toLowerCase().includes(clientFiltre)) return false;
            if (risqueFiltre) {
                if (risqueFiltre === 'true' && !op.risque) return false;
                if (risqueFiltre === 'false' && op.risque) return false;
            }
            return true;
        });

        afficherOperations(filtered);
    }

    // Événements de filtrage
    $('#btnFiltrer').on('click', filtrerOperations);
    $('#exportAlertes').on('click', exporterAlertes);

    // Charger en fonction de la page
    const page = window.location.pathname.split("/").pop();

    chargerComptes();
    chargerOperations().then(() => {
        if (page === 'operations.html') {
            afficherOperations();
        } else if (page === 'alerte.html') {
            afficherAlertes();
            if (alertes.length > 0) {
                $('#alertes').show();
            }
        }
    });
});
