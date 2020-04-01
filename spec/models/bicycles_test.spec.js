var Bicycle = require("../../models/bicycle");

beforeEach(() => {
    Bicycle.allBikes = [];
});

describe("Bicycle.allBikes", () => {
    it("Starts empty", () => {
        expect(Bicycle.allBikes.length).toBe(0);
    })
});

describe("Bicycle.add", () => {
    it("Adding one", () => {
        expect(Bicycle.allBikes.length).toBe(0);

        var a = new Bicycle(1, 'Urban', 'red', [6.2568693,-75.5923187]);
        Bicycle.add(a);
        
        expect(Bicycle.allBikes.length).toBe(1);
        expect(Bicycle.allBikes[0]).toBe(a);
    })
});

describe("Bicycle.findById", () => {
    it("Must to return a bike with ID 1", () => {
        expect(Bicycle.allBikes.length).toBe(0);

        var a = new Bicycle(1, 'Urban', 'green', [6.2568693,-75.5923187]);
        var b = new Bicycle(2, 'Urban', 'white', [6.2616365,-75.5931341]);
        Bicycle.add(a);
        Bicycle.add(b);
        var targetBike = Bicycle.findById(1)

        expect(targetBike.id).toBe(1);
        expect(targetBike.color).toBe(a.color);
        expect(targetBike.model).toBe(a.model);
    })
});

describe("Bicycle.removeById", () => {
    it("Must to remove a bike wit ID 1", () => {
        expect(Bicycle.allBikes.length).toBe(0);

        var a = new Bicycle(1, 'Urban', 'green', [6.2568693,-75.5923187]);
        Bicycle.add(a);

        expect(Bicycle.allBikes.length).toBe(1);
        Bicycle.removeById(1);
        expect(Bicycle.allBikes.length).toBe(0);
    })
});