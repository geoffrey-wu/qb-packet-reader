var validCategories = JSON.parse(localStorage.getItem('validCategories'));
var validSubcategories = JSON.parse(localStorage.getItem('validSubcategories'));

/**
 * On window load, run these functions.
 */

// Keep text fields in localStorage
if (localStorage.getItem('setTitleBonusSave')) {
    setTitle = localStorage.getItem('setTitleBonusSave');
    document.getElementById('set-title').value = setTitle;
    let [year, name] = parseSetTitle(setTitle);
    (async () => {
        maxPacketNumber = await getNumPackets(year, name);
        document.getElementById('packet-number').placeholder = `Packet #s (1-${maxPacketNumber})`;
    })();
}

document.getElementById('set-title').addEventListener('change', function () {
    localStorage.setItem('setTitleBonusSave', this.value);
});

if (localStorage.getItem('packetNumberTossupSave')) {
    document.getElementById('packet-number').value = localStorage.getItem('packetNumberTossupSave');
}

document.getElementById('packet-number').addEventListener('change', function () {
    localStorage.setItem('packetNumberTossupSave', this.value);
});

var questionNumberField = document.getElementById('question-select');
if (localStorage.getItem('questionNumberTossupSave'))
    questionNumberField.value = localStorage.getItem('questionNumberTossupSave');
questionNumberField.addEventListener('change', function () {
    localStorage.setItem('questionNumberTossupSave', questionNumberField.value);
});

// Event listeners
document.getElementById('start').addEventListener('click', async function () {
    this.blur();
    onQuestion = true;
    initialize();
    let [setYear, setName] = parseSetTitle(setTitle);
    await getPacket(setYear, setName, currentPacketNumber, 'bonuses').then(async (data) => {
        questions = data;
        await loadAndReadBonus();
    });
});

document.getElementById('reveal').addEventListener('click', function () {
    this.blur();
    revealBonusPart();
});

document.getElementById('next').addEventListener('click', async function () {
    this.blur();

    if (this.innerHTML === 'Next') {
        updateStats();
        updateStatDisplay();
    }

    onQuestion = true;
    await loadAndReadBonus();
});

document.getElementById('clear-stats').addEventListener('click', function () {
    this.blur();
    clearStats();
});

document.querySelectorAll('#categories input').forEach(input => {
    input.addEventListener('click', function (event) {
        this.blur();
        validCategories = JSON.parse(localStorage.getItem('validCategories'));
        validSubcategories = JSON.parse(localStorage.getItem('validSubcategories'));
        [validCategories, validSubcategories] = updateCategory(input.id, validCategories, validSubcategories);
        localStorage.setItem('validCategories', JSON.stringify(validCategories));
        localStorage.setItem('validSubcategories', JSON.stringify(validSubcategories));
    });
});

document.querySelectorAll('#subcategories input').forEach(input => {
    input.addEventListener('click', function (event) {
        this.blur();
        validSubcategories = updateSubcategory(input.id, validSubcategories);
        localStorage.setItem('validSubcategories', JSON.stringify(validSubcategories));
    });
});

if (localStorage.getItem('validSubcategories') === null)
    localStorage.setItem('validSubcategories', '[]');
if (localStorage.getItem('validCategories') === null)
    localStorage.setItem('validCategories', '[]');

//load the selected categories and subcategories
loadCategoryModal(validCategories, validSubcategories);

/**
 * An array that represents
 * [# of 30's, # of 20's, # of 10's, # of 0's].
 */
 if (sessionStorage.getItem('stats') === null)
 sessionStorage.setItem('stats', [0, 0, 0, 0]);

updateStatDisplay(); //update stats upon loading site