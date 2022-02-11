import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Res, Req, UseInterceptors, UploadedFile, HttpCode, Redirect, Query, HttpStatus, UsePipes, ParseIntPipe, UseGuards, SetMetadata
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { ValidationPipe } from '../shared/pipes/validation.pipe';


import { Response } from 'express';
import { Test } from './interfaces/test.interface';
import { RolesGuard } from 'src/guard/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';


@Controller('test')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor) //bind extra logic before / after method execution
@UseInterceptors(TransformInterceptor) 

// @Controller({ host: 'admin.example.com' })
export class TestController {
  constructor(private readonly testService: TestService) { }


  @Get('redirect')
  @Redirect('https://nestjs.com', 301)
  myTest() {
    return this.testService.findAll();
  }
  @Get('async')
  findAll2(): Observable<any[]> {
    return of(['w']);
  }
  // OR
  @Get('async2')
  async findAll3(): Promise<any[]> {
    return [];
  }
  @UsePipes(new ValidationPipe)
  @Post('create-test')
  async create2(@Body() createCatDto: CreateTestDto) {
    console.log(createCatDto);

    return 'This action adds a new cat2';
  }
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    console.log(version);

    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
  @Get('docsq')
  @Redirect('https://docs.nestjs.com', 302)
  getDocsq(@Query() qry) {
    console.log(qry.id);

    if (qry.id && qry.id === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  @Post('get-json-data')
  getJsonData(@Req() request: Request): any {
    console.log('request', request.body); //get json data
    const req: any = request.body
    //or
    const req2 = request.body;
    console.log('req', req.test);
    console.log('req2', req2['test']);
    return this.testService.findAll();
  }
  @Post('get-from-data')
  @UseInterceptors(FileInterceptor('file'))
  getFormData(@Req() request: Request, @Body() formdata: any, @UploadedFile() file): any {
    console.log('request', request.body); //get same result
    console.log('formdata', formdata); //get same result
    const req: any = request.body;
    //or
    const req2 = request.body;
    console.log('req', req.test);
    console.log('req2', req2['test']);
    return this.testService.findAll();
  }
  @Post('get-from-data-with-file')
  @UseInterceptors(FileInterceptor('file'))
  getFormDataWithFile(@Req() request: Request, @Body() formdata: any, @UploadedFile() file): any {
    console.log('request', request.body);//get same result
    console.log('file', file);
    console.log('formdata', formdata);//get same result
    const req: any = request.body
    //or
    const req2 = request.body;
    console.log('req', req.test);
    console.log('req2', req2['test']);
    return this.testService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }
  @Get('validate/:id')
  validateId(@Param('id', new ParseIntPipe()) id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
  @Post('create-post')
  createPost(@Res() res: Response) {
    return res.status(HttpStatus.CREATED).send('r');
  }

  @Get('get-all')
  getAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }

  @Post('create-new')
  async createNew(@Body() createCatDto: CreateTestDto) {
    this.testService.createTest(createCatDto);
  }

  @Get('get-new')
  async getnew(): Promise<Test[]> {
    return this.testService.getTest();
  }

  // @Post()
  // create(@Body() createTestDto: CreateTestDto) {
  //   return this.testService.create(createTestDto);
  // }

  // @Get()
  // @HttpCode(200)
  // findAll() {
  //   return this.testService.findAll();
  // }
  @Post('check-roles')
  // @SetMetadata('roles', ['admin'])
  @Roles('admin')
  async create(@Body() createCatDto: CreateTestDto) {
    this.testService.create(createCatDto);
  }

}
