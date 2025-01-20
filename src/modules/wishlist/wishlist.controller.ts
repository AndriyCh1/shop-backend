import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtRefreshGuard } from '#modules/auth/guards/jwt-refresh.guard';
import { AuthUser } from '#modules/auth/interfaces/auth.interface';
import { WishlistResponseDto } from '#modules/wishlist/dtos/response/wishlist-response.dto';
import { WishlistMapper } from '#modules/wishlist/mappers/wishlist.mapper';
import { WishlistService } from '#modules/wishlist/services/wishlist.service';
import { User } from '#shared/decorators/user.decorator';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('products/:productId')
  @UseGuards(JwtRefreshGuard)
  async addToWishlist(
    @User() user: AuthUser,
    @Param('productId') productId: number,
  ): Promise<WishlistResponseDto> {
    return WishlistMapper.toResponse(
      await this.wishlistService.addToWishlist(user.id, productId),
    );
  }

  @Get()
  @UseGuards(JwtRefreshGuard)
  async getWishlist(@User() user: AuthUser): Promise<WishlistResponseDto[]> {
    return WishlistMapper.toResponseList(
      await this.wishlistService.getWishlist(user.id),
    );
  }

  @Delete(':id')
  @UseGuards(JwtRefreshGuard)
  deleteFromWishlist(@Param('id') id: number): Promise<void> {
    return this.wishlistService.deleteFromWishlist(id);
  }
}
