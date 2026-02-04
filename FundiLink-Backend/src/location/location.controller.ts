import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationResponse, LocationsResponse } from './location.interface';

@Controller('/api/locations/v1')
export class LocationController {
    constructor(private locationService:LocationService){}

    @Get("/")
    getLocations():Promise<LocationsResponse>{
        return this.locationService.getLocations();
    }

    @Post("/create")
    createLocation(@Body() payload:CreateLocationDto):Promise<LocationResponse>{
        return this.locationService.createLocation(payload);
    }
}
