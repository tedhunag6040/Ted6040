/**
 * DFRobot Gravity Analog pH Sensor 擴展
 * 提供 pH 值讀取與軟體校準功能
 */
//% weight=99 color=#00A6F0 icon="\uf0c3" block="水質 pH"
namespace GravityPH {
    
    // 校準偏移量 (Offset)
    // 預設值需根據實際硬體與工作電壓調整，通常在 5V 供電下約為 -1.5 到 1.5 之間
    let phOffset: number = 0.00;

    /**
     * 設定 pH 感測器的校準偏移量 (Offset)
     * 用於配合標準緩衝液進行單點校準
     * @param offset 偏移數值，例如: 0.15
     */
    //% block="設定 pH 校準偏移量為 $offset"
    //% weight=90
    export function setPHOffset(offset: number): void {
        phOffset = offset;
    }

    /**
     * 從指定腳位讀取並計算 pH 值
     * 內建 10 次採樣平均濾波
     * @param pin 連接 pH 模組的類比腳位
     */
    //% block="讀取 pH 值 於腳位 $pin"
    //% weight=100
    export function readPH(pin: AnalogPin): number {
        let sum = 0;
        const sampleCount = 10;

        // 1. 採樣與軟體濾波 (均值濾波)
        for (let i = 0; i < sampleCount; i++) {
            sum += pins.analogReadPin(pin);
            basic.pause(5); // 讓 ADC 穩定
        }
        let averageRaw = sum / sampleCount;

        // 2. 轉換為電壓 (Volts)
        // 注意：這裡假設 micro:bit ADC 基準為 3.3V (3300mV)
        let voltage = (averageRaw / 1023.0) * 3.3;

        // 3. 套用轉換公式計算 pH 值
        // 標準公式： pH = 3.5 * Voltage + Offset
        let phValue = 3.5 * voltage + phOffset;

        // 4. 數值範圍限制防呆 (理論上範圍是 0-14)
        if (phValue < 0.0) phValue = 0.0;
        if (phValue > 14.0) phValue = 14.0;

        // 取小數點後兩位返回
        return Math.round(phValue * 100) / 100;
    }
}
