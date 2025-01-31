let device;
let characteristic;
let notifyCharacteristic;

document.getElementById('connect').addEventListener('click', async () => {
    try {

        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['c28adae4-3f57-4202-b8da-3cedc017a28e']
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('c28adae4-3f57-4202-b8da-3cedc017a28e');
        characteristic = await service.getCharacteristic('656de60a-d7ae-4f22-98cf-8812e198c8f4');
        // Get the notify characteristic
        notifyCharacteristic = await service.getCharacteristic('70461dfc-8c14-49e7-bdff-cfbe5a4ca946'); // Replace with the actual UUID
        document.getElementById('status').textContent = 'Connected';
        document.getElementById('status').style.color = 'green';
        // Enable the controls
        enableControls();
        // document.getElementById('reset').disabled = false;
        // document.getElementById('sendCommand').disabled = false;
        // document.getElementById('terminal').disabled = false;
        // document.getElementById('availability').disabled = false;
        // document.getElementById('reset').disabled = false;
        // document.getElementById('powerSwitch').disabled = false;
        // document.getElementById('multicolorSwitch').disabled = false;
        // document.getElementById('brightnessSlider').disabled = false;
        // document.getElementById('speedSlider').disabled = false;
        // document.getElementById('colorPicker').disabled = false;

        // Start notifications
        await notifyCharacteristic.startNotifications();
        notifyCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    } catch (error) {
        console.error('Connection failed', error);
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('status').style.color = 'red';
    }
});

function enableControls() {
    const controls = document.querySelectorAll('button, input, textarea, div');
    controls.forEach(control => control.disabled = false);
}

function handleCharacteristicValueChanged(event) {
    const value = new TextDecoder().decode(event.target.value);
    document.getElementById('notifyValue').textContent = `Notify Value: ${value}`;
}

document.getElementById('sendCommand').addEventListener('click', async () => {
    const command = document.getElementById('terminal').value;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('availability').addEventListener('click', async () => {
    const button = document.getElementById('availability');
    const command = button.classList.contains('green') ? 'Unavailable' : 'Available';
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
    button.textContent = command;
    button.classList.toggle('green');
    button.classList.toggle('red');
});

document.getElementById('reset').addEventListener('click', async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode('reset');
    await characteristic.writeValue(data);
});

document.getElementById('powerSwitch').addEventListener('change', async (event) => {
    let command = event.target.checked ? 'on' : 'off';
    let encoder = new TextEncoder();
    let data = encoder.encode(command);
    await characteristic.writeValue(data);
    document.getElementById('powerLabel').textContent = `Screen: ${command}`;
});

document.getElementById('multicolorSwitch').addEventListener('change', async (event) => {
    let command = event.target.checked ? 'multicolor:on' : 'multicolor:off';
    let encoder = new TextEncoder();
    let data = encoder.encode(command);
    await characteristic.writeValue(data);
    document.getElementById('multicolorLabel').textContent = `${command}`;
});

document.getElementById('brightnessSlider').addEventListener('input', async (event) => {
    const value = event.target.value;
    document.getElementById('brightnessValue').textContent = value;
    const command = `brightness:${value}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('speedSlider').addEventListener('input', async (event) => {
    const value = event.target.value;
    document.getElementById('speedValue').textContent = value;
    const command = `speed:${value}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('sizeSlider').addEventListener('input', async (event) => {
    const value = event.target.value;
    document.getElementById('sizeValue').textContent = value;
    const command = `size:${value}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('colorPicker').addEventListener('input', async (event) => {
    const color = event.target.value;
    const r = parseInt(color.slice(1, 3), 16).toString().padStart(3, '0');
    const g = parseInt(color.slice(3, 5), 16).toString().padStart(3, '0');
    const b = parseInt(color.slice(5, 7), 16).toString().padStart(3, '0');
    const command = `color:${r},${g},${b}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('wrapSwitch').addEventListener('change', async (event) => {
    let command = event.target.checked ? 'wrap:on' : 'wrap:off';
    let encoder = new TextEncoder();
    let data = encoder.encode(command);
    await characteristic.writeValue(data);
    document.getElementById('wrapLabel').textContent = `${command}`;
});

document.getElementById('plasmaSwitch').addEventListener('change', async (event) => {
    let command = event.target.checked ? 'plasma:on' : 'plasma:off';
    let encoder = new TextEncoder();
    let data = encoder.encode(command);
    await characteristic.writeValue(data);
    document.getElementById('plasmaLabel').textContent = `${command}`;
});

function handleFontButton(buttonId, command) {
    const button = document.getElementById(buttonId);
    button.addEventListener('click', async () => {
        await writeBluetoothData(command);
    });
}

async function writeBluetoothData(command) {
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
}

handleFontButton('fontDefault', 'font:default');
handleFontButton('fontSans', 'font:sans');
handleFontButton('fontSerif', 'font:serif');
handleFontButton('fontMono', 'font:mono');

function handleEmojiButton(button) {
    button.addEventListener('click', async () => {
        const command = button.getAttribute('data-emoji');
        await writeBluetoothData(command);
    });
}

document.querySelectorAll('.emojiButton').forEach(button => handleEmojiButton(button));

document.getElementById('toggleButton1').addEventListener('click', function() {
    let collapsibleDiv = document.getElementById('emoji1Section');
    collapsibleDiv.classList.toggle('open');
});

document.getElementById('toggleButton2').addEventListener('click', function() {
    let collapsibleDiv = document.getElementById('emoji2Section');
    collapsibleDiv.classList.toggle('open');
});

document.getElementById('clear').addEventListener('click', async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode('clear');
    await characteristic.writeValue(data);
});
