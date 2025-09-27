"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TourFormBuildPayload = void 0;
var core_1 = require("@angular/core");
var TourFormBuildPayload = /** @class */ (function () {
    function TourFormBuildPayload() {
    }
    TourFormBuildPayload.prototype.buildPayload = function (form, coverFile, guidesArray) {
        var fv = form.value;
        var formData = new FormData();
        // Basic fields
        [
            'name',
            'duration',
            'difficulty',
            'maxGroupSize',
            'secret',
            'summary',
            'description',
        ].forEach(function (key) {
            formData.append(key, fv[key]);
        });
        // Price
        formData.append('price', fv.prices.price);
        formData.append('priceDiscount', fv.prices.priceDiscount);
        // Cover image
        if (coverFile) {
            formData.append('imageCover', coverFile);
        }
        else if (fv.imageCover) {
            formData.append('imageCover', fv.imageCover);
        }
        // Images
        var fileIndexes = [];
        fv.images.forEach(function (img, i) {
            if (img instanceof File) {
                fileIndexes.push(i);
            }
        });
        // Append the index metadata as JSON string
        formData.append('imagesIndexes', JSON.stringify(fileIndexes));
        // Append images normally, order doesn't matter as long as backend uses indexes
        fv.images.forEach(function (img, i) {
            if (img instanceof File) {
                formData.append('images', img);
            }
            else if (typeof img === 'string' && img.length > 0) {
                formData.append('images', img);
            }
            else {
                formData.append('images', ''); // empty slot
            }
        });
        // Dates
        var formattedDates = this.formatDates(fv.startDates);
        formattedDates === null || formattedDates === void 0 ? void 0 : formattedDates.forEach(function (date) { return formData.append('startDates', date); });
        // Guides
        guidesArray.value.forEach(function (g) {
            if (g._id)
                formData.append('guides', g._id);
        });
        // Locations — send as objects, not JSON strings
        fv.locations.forEach(function (loc, i) {
            formData.append("locations[" + i + "][type]", 'Point');
            formData.append("locations[" + i + "][coordinates][]", loc.coordinates.lng);
            formData.append("locations[" + i + "][coordinates][]", loc.coordinates.lat);
            formData.append("locations[" + i + "][description]", loc.description || '');
            formData.append("locations[" + i + "][day]", loc.day);
        });
        // Start location
        formData.append('startLocation[type]', 'Point');
        formData.append('startLocation[coordinates][]', fv.startLocation.startCoordinates.lng);
        formData.append('startLocation[coordinates][]', fv.startLocation.startCoordinates.lat);
        formData.append('startLocation[address]', fv.startLocation.startAddress || '');
        formData.append('startLocation[description]', fv.startLocation.startDescription || '');
        return formData;
    };
    TourFormBuildPayload.prototype.formatDates = function (dates) {
        if (dates === void 0) { dates = []; }
        if (!dates.length)
            return [];
        return dates
            .map(function (d) { return d.date; })
            .filter(Boolean)
            .map(function (d) { return new Date(d).toISOString(); });
    };
    TourFormBuildPayload = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], TourFormBuildPayload);
    return TourFormBuildPayload;
}());
exports.TourFormBuildPayload = TourFormBuildPayload;
