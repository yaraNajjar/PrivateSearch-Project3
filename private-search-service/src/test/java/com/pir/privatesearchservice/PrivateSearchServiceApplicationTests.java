package com.pir.privatesearchservice;

import com.pir.privatesearchservice.bean.SearchHistory;
import com.pir.privatesearchservice.service.ProductService;
import com.pir.privatesearchservice.service.SearchHistoryService;
import com.pir.privatesearchservice.service.SearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class PrivateSearchServiceApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private SearchService searchService;

	@MockBean
	private ProductService productService;

	@MockBean
	private SearchHistoryService searchHistoryService;

	@Test
	void testSearchProducts() throws Exception {
		// Setting up test data
		int productId = 123;
		long userId = 1;
		ArrayList<Object> expectedResult = new ArrayList<>();
		expectedResult.add(productId); // Product ID
		expectedResult.add("Test Product"); // Product Name
		expectedResult.add("Test Description"); // Product Description
		expectedResult.add(10.0); // Product Price
		expectedResult.add(5); // Product Quantity

		// Mocking service behavior
		when(searchService.performSearch(productId, userId)).thenReturn(expectedResult);

		// Performing the test
		mockMvc.perform(MockMvcRequestBuilders.get("/api/products/searchProducts")
						.param("productId", String.valueOf(productId))
						.param("userId", String.valueOf(userId))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$[0]").value(productId))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1]").value("Test Product"))
				.andExpect(MockMvcResultMatchers.jsonPath("$[2]").value("Test Description"))
				.andExpect(MockMvcResultMatchers.jsonPath("$[3]").value(10.0))
				.andExpect(MockMvcResultMatchers.jsonPath("$[4]").value(5));
	}

	@Test
	public void testGetSearchHistoryForUser() throws Exception {
		// Prepare test data
		long userId = 2;
		List<SearchHistory> searchHistoryList = new ArrayList<>();
		SearchHistory searchHistory1 = new SearchHistory();
		searchHistory1.setUserId(2L);
		searchHistory1.setProductId(2);
		searchHistory1.setProductName("iphone14");
		searchHistory1.setResponseTime(187L);

		SearchHistory searchHistory2 = new SearchHistory();
		searchHistory2.setUserId(3L);
		searchHistory2.setProductId(3);
		searchHistory2.setProductName("iphone12");
		searchHistory2.setResponseTime(40L);

		SearchHistory searchHistory3 = new SearchHistory();
		searchHistory3.setUserId(2L);
		searchHistory3.setProductId(1);
		searchHistory3.setProductName("iphone15");
		searchHistory3.setResponseTime(48L);

		searchHistoryList.add(searchHistory1);
		searchHistoryList.add(searchHistory3);

		// Mock the service method
		when(searchHistoryService.getSearchHistoryForUser(userId)).thenReturn(searchHistoryList);

		// Perform the GET request
		mockMvc.perform(MockMvcRequestBuilders.get("/api/search/history/{userId}", userId)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$[0].userId").value(2))
				.andExpect(MockMvcResultMatchers.jsonPath("$[0].productId").value(2))
				.andExpect(MockMvcResultMatchers.jsonPath("$[0].productName").value("iphone14"))
				.andExpect(MockMvcResultMatchers.jsonPath("$[0].responseTime").value(187))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1].userId").value(2))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1].productId").value(1))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1].productName").value("iphone15"))
				.andExpect(MockMvcResultMatchers.jsonPath("$[1].responseTime").value(48));
	}
}
